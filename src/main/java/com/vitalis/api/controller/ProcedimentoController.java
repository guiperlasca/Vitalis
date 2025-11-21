package com.vitalis.api.controller;

import com.vitalis.api.dto.ProcedimentoRequestDTO;
import com.vitalis.api.dto.ProcedimentoResponseDTO;
import com.vitalis.api.service.ProcedimentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Procedimentos", description = "Gerenciamento de Procedimentos e Serviços")
public class ProcedimentoController {

    private final ProcedimentoService procedimentoService;

    @PostMapping("/procedimentos")
    @Operation(summary = "Criar novo procedimento")
    public ResponseEntity<ProcedimentoResponseDTO> cadastrar(@Valid @RequestBody ProcedimentoRequestDTO dto) {
        ProcedimentoResponseDTO response = procedimentoService.cadastrar(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/clinicas/{clinicaId}/procedimentos")
    @Operation(summary = "Listar procedimentos de uma clínica")
    public ResponseEntity<List<ProcedimentoResponseDTO>> listarPorClinica(@PathVariable Long clinicaId) {
        List<ProcedimentoResponseDTO> response = procedimentoService.listarPorClinica(clinicaId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/procedimentos/{id}")
    @Operation(summary = "Buscar procedimento por ID")
    public ResponseEntity<ProcedimentoResponseDTO> buscarPorId(@PathVariable Long id) {
        ProcedimentoResponseDTO response = procedimentoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }
}
