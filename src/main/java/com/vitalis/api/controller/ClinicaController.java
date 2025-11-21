package com.vitalis.api.controller;

import com.vitalis.api.dto.ClinicaRequestDTO;
import com.vitalis.api.dto.ClinicaResponseDTO;
import com.vitalis.api.service.ClinicaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clinicas")
@RequiredArgsConstructor
@Tag(name = "Clínicas", description = "Gerenciamento de Clínicas")
public class ClinicaController {

    private final ClinicaService clinicaService;

    @PostMapping
    @Operation(summary = "Cadastrar nova clínica")
    public ResponseEntity<ClinicaResponseDTO> cadastrar(@Valid @RequestBody ClinicaRequestDTO dto) {
        ClinicaResponseDTO response = clinicaService.cadastrar(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar clínicas (opcional: filtrar por especialidade)")
    public ResponseEntity<List<ClinicaResponseDTO>> listar(@RequestParam(required = false) String especialidade) {
        List<ClinicaResponseDTO> response = clinicaService.listar(especialidade);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar clínica por ID")
    public ResponseEntity<ClinicaResponseDTO> buscarPorId(@PathVariable Long id) {
        ClinicaResponseDTO response = clinicaService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar dados da clínica")
    public ResponseEntity<ClinicaResponseDTO> atualizar(@PathVariable Long id,
            @Valid @RequestBody ClinicaRequestDTO dto) {
        ClinicaResponseDTO response = clinicaService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Inativar clínica")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        clinicaService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
