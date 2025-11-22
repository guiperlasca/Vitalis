package com.vitalis.api.service;

import com.vitalis.api.dto.AgendamentoRequestDTO;
import com.vitalis.api.dto.AgendamentoResponseDTO;
import com.vitalis.api.dto.ProcedimentoResponseDTO;
import com.vitalis.api.entity.*;
import com.vitalis.api.exception.BusinessException;
import com.vitalis.api.exception.EntityNotFoundException;
import com.vitalis.api.repository.AgendamentoRepository;
import com.vitalis.api.repository.ClinicaRepository;
import com.vitalis.api.repository.PacienteRepository;
import com.vitalis.api.repository.ProcedimentoRepository;
import com.vitalis.api.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ClinicaRepository clinicaRepository;
    private final PacienteRepository pacienteRepository;
    private final ProcedimentoRepository procedimentoRepository;
    private final SecurityUtils securityUtils;
    private final ModelMapper modelMapper;

    @Transactional
    public AgendamentoResponseDTO solicitarAgendamento(AgendamentoRequestDTO dto) {
        Usuario usuarioLogado = securityUtils.getCurrentUser();
        Paciente paciente = pacienteRepository.findByEmail(usuarioLogado.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado para o usuário logado."));

        Clinica clinica = clinicaRepository.findById(dto.getClinicaId())
                .orElseThrow(() -> new EntityNotFoundException("Clínica não encontrada com ID: " + dto.getClinicaId()));

        if (!clinica.isAtivo()) {
            throw new BusinessException("Não é possível agendar em uma clínica inativa.");
        }

        List<Procedimento> procedimentos = procedimentoRepository.findAllById(dto.getProcedimentoIds());

        if (procedimentos.size() != dto.getProcedimentoIds().size()) {
            throw new EntityNotFoundException("Um ou mais procedimentos não foram encontrados.");
        }

        for (Procedimento proc : procedimentos) {
            if (!proc.getClinica().getId().equals(clinica.getId())) {
                throw new BusinessException(
                        "O procedimento '" + proc.getNome() + "' não pertence à clínica selecionada.");
            }
            if (!proc.isDisponivel()) {
                throw new BusinessException("O procedimento '" + proc.getNome() + "' não está disponível.");
            }
        }

        Agendamento agendamento = Agendamento.builder()
                .paciente(paciente)
                .clinica(clinica)
                .procedimentos(procedimentos)
                .dataHora(dto.getDataHora())
                .status(AgendamentoStatus.PENDENTE)
                .observacoes(dto.getObservacoes())
                .build();

        agendamento.calcularValorTotal();

        agendamento = agendamentoRepository.save(agendamento);
        return toResponseDTO(agendamento);
    }

    public List<AgendamentoResponseDTO> listarMeusAgendamentos() {
        Usuario usuarioLogado = securityUtils.getCurrentUser();
        List<Agendamento> agendamentos;

        if (usuarioLogado.getRole() == UserRole.ROLE_PACIENTE) {
            Paciente paciente = pacienteRepository.findByEmail(usuarioLogado.getEmail())
                    .orElseThrow(() -> new EntityNotFoundException("Perfil de paciente não encontrado."));
            agendamentos = agendamentoRepository.findByPacienteId(paciente.getId());
        } else {
            // For clinics, we would need to find the clinic associated with the user.
            // Currently assuming empty for non-patients as per previous logic/limitations.
            agendamentos = List.of();
        }

        return agendamentos.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<AgendamentoResponseDTO> listarAgendamentosPorClinica(Long clinicaId) {
        // TODO: Verify if the logged in user has access to this clinic's data
        return agendamentoRepository.findByClinicaId(clinicaId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AgendamentoResponseDTO atualizarStatus(Long id, String novoStatusStr) {
        Agendamento agendamento = buscarPorId(id);
        AgendamentoStatus novoStatus;
        try {
            novoStatus = AgendamentoStatus.valueOf(novoStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Status inválido: " + novoStatusStr);
        }

        // Logic to validate transitions could go here
        if (agendamento.getStatus() == AgendamentoStatus.REALIZADO && novoStatus == AgendamentoStatus.CANCELADO) {
            throw new BusinessException("Não é possível cancelar um agendamento já realizado.");
        }

        agendamento.setStatus(novoStatus);
        agendamentoRepository.save(agendamento);
        return toResponseDTO(agendamento);
    }

    @Transactional
    public void cancelarAgendamento(Long id) {
        atualizarStatus(id, "CANCELADO");
    }

    // Legacy methods kept for compatibility if needed, or refactored to use
    // atualizarStatus
    @Transactional
    public void confirmarAgendamento(Long id) {
        atualizarStatus(id, "CONFIRMADO");
    }

    @Transactional
    public void finalizarAtendimento(Long id) {
        atualizarStatus(id, "REALIZADO");
    }

    private Agendamento buscarPorId(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado com ID: " + id));
    }

    private AgendamentoResponseDTO toResponseDTO(Agendamento agendamento) {
        List<ProcedimentoResponseDTO> procedimentosDTO = agendamento.getProcedimentos().stream()
                .map(proc -> {
                    ProcedimentoResponseDTO dto = modelMapper.map(proc, ProcedimentoResponseDTO.class);
                    dto.setClinicaId(proc.getClinica().getId());
                    dto.setClinicaNomeFantasia(proc.getClinica().getNomeFantasia());
                    return dto;
                })
                .collect(Collectors.toList());

        return AgendamentoResponseDTO.builder()
                .id(agendamento.getId())
                .pacienteNome(agendamento.getPaciente().getNome())
                .clinicaNomeFantasia(agendamento.getClinica().getNomeFantasia())
                .procedimentos(procedimentosDTO)
                .dataHora(agendamento.getDataHora())
                .valorTotal(agendamento.getValorTotal())
                .status(agendamento.getStatus())
                .observacoes(agendamento.getObservacoes())
                .build();
    }
}
