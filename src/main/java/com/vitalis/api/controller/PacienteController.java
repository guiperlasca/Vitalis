package com.vitalis.api.controller;

import com.vitalis.api.dto.PacienteRequestDTO;
import com.vitalis.api.dto.PacienteResponseDTO;
import com.vitalis.api.service.PacienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
@Tag(name = "Pacientes", description = "Gerenciamento de Pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    @PostMapping
    @Operation(summary = "Cadastrar novo paciente")
    public ResponseEntity<PacienteResponseDTO> cadastrar(@Valid @RequestBody PacienteRequestDTO dto) {
        PacienteResponseDTO response = pacienteService.cadastrar(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar todos os pacientes")
    public ResponseEntity<List<PacienteResponseDTO>> listarTodos() {
        List<PacienteResponseDTO> response = pacienteService.listarTodos();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar paciente por ID")
    public ResponseEntity<PacienteResponseDTO> buscarPorId(@PathVariable Long id) {
        PacienteResponseDTO response = pacienteService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar dados do paciente")
    public ResponseEntity<PacienteResponseDTO> atualizar(@PathVariable Long id,
            @Valid @RequestBody PacienteRequestDTO dto) {
        PacienteResponseDTO response = pacienteService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }
}
