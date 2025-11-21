package com.vitalis.api.service;

import com.vitalis.api.dto.PacienteRequestDTO;
import com.vitalis.api.dto.PacienteResponseDTO;
import com.vitalis.api.entity.Paciente;
import com.vitalis.api.exception.ConflictException;
import com.vitalis.api.exception.EntityNotFoundException;
import com.vitalis.api.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public PacienteResponseDTO cadastrar(PacienteRequestDTO dto) {
        if (pacienteRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ConflictException("Email já cadastrado: " + dto.getEmail());
        }

        Paciente paciente = modelMapper.map(dto, Paciente.class);
        paciente = pacienteRepository.save(paciente);
        return modelMapper.map(paciente, PacienteResponseDTO.class);
    }

    public PacienteResponseDTO buscarPorId(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + id));
        return modelMapper.map(paciente, PacienteResponseDTO.class);
    }

    public List<PacienteResponseDTO> listarTodos() {
        return pacienteRepository.findAll().stream()
                .map(paciente -> modelMapper.map(paciente, PacienteResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public PacienteResponseDTO atualizar(Long id, PacienteRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + id));

        // Check if email is being changed to one that already exists
        if (!paciente.getEmail().equals(dto.getEmail()) && pacienteRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ConflictException("Email já cadastrado: " + dto.getEmail());
        }

        modelMapper.map(dto, paciente);
        // Ensure ID remains the same
        paciente.setId(id);

        paciente = pacienteRepository.save(paciente);
        return modelMapper.map(paciente, PacienteResponseDTO.class);
    }
}
