package com.vitalis.api.service;

import com.vitalis.api.dto.ProcedimentoRequestDTO;
import com.vitalis.api.dto.ProcedimentoResponseDTO;
import com.vitalis.api.entity.Clinica;
import com.vitalis.api.entity.Procedimento;
import com.vitalis.api.exception.BusinessException;
import com.vitalis.api.exception.EntityNotFoundException;
import com.vitalis.api.repository.ClinicaRepository;
import com.vitalis.api.repository.ProcedimentoRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProcedimentoService {

    private final ProcedimentoRepository procedimentoRepository;
    private final ClinicaRepository clinicaRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public ProcedimentoResponseDTO cadastrar(ProcedimentoRequestDTO dto) {
        Clinica clinica = clinicaRepository.findById(dto.getClinicaId())
                .orElseThrow(() -> new EntityNotFoundException("Clínica não encontrada com ID: " + dto.getClinicaId()));

        if (!clinica.isAtivo()) {
            throw new BusinessException("Não é possível cadastrar procedimentos para uma clínica inativa.");
        }

        Procedimento procedimento = modelMapper.map(dto, Procedimento.class);
        procedimento.setClinica(clinica);

        procedimento = procedimentoRepository.save(procedimento);
        return toResponseDTO(procedimento);
    }

    public List<ProcedimentoResponseDTO> listarPorClinica(Long clinicaId) {
        if (!clinicaRepository.existsById(clinicaId)) {
            throw new EntityNotFoundException("Clínica não encontrada com ID: " + clinicaId);
        }

        List<Procedimento> procedimentos = procedimentoRepository.findByClinicaId(clinicaId);
        return procedimentos.stream()
                .filter(Procedimento::isDisponivel)
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private ProcedimentoResponseDTO toResponseDTO(Procedimento procedimento) {
        ProcedimentoResponseDTO dto = modelMapper.map(procedimento, ProcedimentoResponseDTO.class);
        dto.setClinicaId(procedimento.getClinica().getId());
        dto.setClinicaNomeFantasia(procedimento.getClinica().getNomeFantasia());
        return dto;
    }
}
