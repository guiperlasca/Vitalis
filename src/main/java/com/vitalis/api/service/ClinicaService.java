package com.vitalis.api.service;

import com.vitalis.api.dto.ClinicaRequestDTO;
import com.vitalis.api.dto.ClinicaResponseDTO;
import com.vitalis.api.entity.Clinica;
import com.vitalis.api.exception.EntityNotFoundException;
import com.vitalis.api.repository.ClinicaRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicaService {

    private final ClinicaRepository clinicaRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public ClinicaResponseDTO cadastrar(ClinicaRequestDTO dto) {
        Clinica clinica = modelMapper.map(dto, Clinica.class);
        clinica = clinicaRepository.save(clinica);
        return modelMapper.map(clinica, ClinicaResponseDTO.class);
    }

    public List<ClinicaResponseDTO> listar(String especialidade) {
        List<Clinica> clinicas;
        if (especialidade != null && !especialidade.isBlank()) {
            clinicas = clinicaRepository.findByEspecialidadeIgnoreCase(especialidade);
        } else {
            clinicas = clinicaRepository.findAll();
        }

        return clinicas.stream()
                .map(clinica -> modelMapper.map(clinica, ClinicaResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public void inativar(Long id) {
        Clinica clinica = clinicaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Clínica não encontrada com ID: " + id));
        clinica.setAtivo(false);
        clinicaRepository.save(clinica);
    }

    @Transactional
    public ClinicaResponseDTO atualizar(Long id, ClinicaRequestDTO dto) {
        Clinica clinica = clinicaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Clínica não encontrada com ID: " + id));

        modelMapper.map(dto, clinica);
        // Ensure ID remains the same
        clinica.setId(id);

        clinica = clinicaRepository.save(clinica);
        return modelMapper.map(clinica, ClinicaResponseDTO.class);
    }

    public ClinicaResponseDTO buscarPorId(Long id) {
        Clinica clinica = clinicaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Clínica não encontrada com ID: " + id));
        return modelMapper.map(clinica, ClinicaResponseDTO.class);
    }
}
