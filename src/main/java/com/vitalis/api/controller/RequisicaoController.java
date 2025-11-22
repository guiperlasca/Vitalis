package com.vitalis.api.controller;

import com.vitalis.api.dto.RequisicaoRequestDTO;
import com.vitalis.api.dto.RequisicaoResponseDTO;
import com.vitalis.api.entity.RequisicaoPrioridade;
import com.vitalis.api.entity.RequisicaoStatus;
import com.vitalis.api.service.RequisicaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requisicoes")
@RequiredArgsConstructor
@Tag(name = "Requisições", description = "Endpoints para gestão de requisições (Admin apenas)")
@SecurityRequirement(name = "bearer-jwt")
public class RequisicaoController {

    private final RequisicaoService requisicaoService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar nova requisição")
    public ResponseEntity<RequisicaoResponseDTO> criarRequisicao(@Valid @RequestBody RequisicaoRequestDTO requestDTO) {
        RequisicaoResponseDTO response = requisicaoService.criarRequisicao(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas as requisições")
    public ResponseEntity<List<RequisicaoResponseDTO>> listarTodas() {
        List<RequisicaoResponseDTO> requisicoes = requisicaoService.listarTodas();
        return ResponseEntity.ok(requisicoes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar requisição por ID")
    public ResponseEntity<RequisicaoResponseDTO> buscarPorId(@PathVariable Long id) {
        RequisicaoResponseDTO requisicao = requisicaoService.buscarPorId(id);
        return ResponseEntity.ok(requisicao);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar requisições por status")
    public ResponseEntity<List<RequisicaoResponseDTO>> buscarPorStatus(@PathVariable RequisicaoStatus status) {
        List<RequisicaoResponseDTO> requisicoes = requisicaoService.buscarPorStatus(status);
        return ResponseEntity.ok(requisicoes);
    }

    @GetMapping("/prioridade/{prioridade}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar requisições por prioridade")
    public ResponseEntity<List<RequisicaoResponseDTO>> buscarPorPrioridade(
            @PathVariable RequisicaoPrioridade prioridade) {
        List<RequisicaoResponseDTO> requisicoes = requisicaoService.buscarPorPrioridade(prioridade);
        return ResponseEntity.ok(requisicoes);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar requisição")
    public ResponseEntity<RequisicaoResponseDTO> atualizarRequisicao(
            @PathVariable Long id,
            @Valid @RequestBody RequisicaoRequestDTO requestDTO) {
        RequisicaoResponseDTO response = requisicaoService.atualizarRequisicao(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar apenas o status da requisição")
    public ResponseEntity<RequisicaoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestParam RequisicaoStatus status) {
        RequisicaoResponseDTO response = requisicaoService.atualizarStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deletar requisição")
    public ResponseEntity<Void> deletarRequisicao(@PathVariable Long id) {
        requisicaoService.deletarRequisicao(id);
        return ResponseEntity.noContent().build();
    }
}
