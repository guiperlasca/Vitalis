package com.vitalis.api.controller;

import com.vitalis.api.dto.AvaliacaoRequestDTO;
import com.vitalis.api.entity.Avaliacao;
import com.vitalis.api.service.AvaliacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/avaliacoes")
@RequiredArgsConstructor
@Tag(name = "Avaliações", description = "Sistema de Reputação")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    @PostMapping
    @PreAuthorize("hasRole('PACIENTE')")
    @Operation(summary = "Avaliar um atendimento realizado")
    public ResponseEntity<Avaliacao> avaliarAtendimento(@RequestBody @Valid AvaliacaoRequestDTO dto) {
        Avaliacao avaliacao = avaliacaoService.avaliarAtendimento(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(avaliacao);
    }
}
