package com.vitalis.api.service;

import com.vitalis.api.dto.ProntuarioDTO;
import com.vitalis.api.entity.Agendamento;
import com.vitalis.api.entity.AgendamentoStatus;
import com.vitalis.api.entity.Prontuario;
import com.vitalis.api.exception.BusinessException;
import com.vitalis.api.exception.EntityNotFoundException;
import com.vitalis.api.repository.AgendamentoRepository;
import com.vitalis.api.repository.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public ProntuarioDTO registrarProntuario(Long agendamentoId, ProntuarioDTO dto) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado"));

        if (agendamento.getStatus() != AgendamentoStatus.CONFIRMADO
                && agendamento.getStatus() != AgendamentoStatus.REALIZADO) {
            throw new BusinessException(
                    "Prontuário só pode ser registrado para agendamentos confirmados ou realizados.");
        }

        if (prontuarioRepository.findByAgendamentoId(agendamentoId).isPresent()) {
            throw new BusinessException("Já existe um prontuário registrado para este agendamento.");
        }

        Prontuario prontuario = Prontuario.builder()
                .agendamento(agendamento)
                .descricaoSintomas(dto.getDescricaoSintomas())
                .diagnostico(dto.getDiagnostico())
                .prescricaoMedica(dto.getPrescricaoMedica())
                .build();

        Prontuario saved = prontuarioRepository.save(prontuario);
        return modelMapper.map(saved, ProntuarioDTO.class);
    }

    public ProntuarioDTO buscarPorAgendamento(Long agendamentoId) {
        return prontuarioRepository.findByAgendamentoId(agendamentoId)
                .map(p -> modelMapper.map(p, ProntuarioDTO.class))
                .orElse(null);
    }
}
