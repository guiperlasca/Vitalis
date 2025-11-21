package com.vitalis.api.controller;

import com.vitalis.api.dto.AgendamentoRequestDTO;
import com.vitalis.api.dto.AgendamentoResponseDTO;
import com.vitalis.api.entity.AgendamentoStatus;
import com.vitalis.api.service.AgendamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
@Tag(name = "Agendamentos", description = "Gestão de Consultas e Agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    @PostMapping
    @Operation(summary = "Solicitar novo agendamento")
    public ResponseEntity<AgendamentoResponseDTO> solicitarAgendamento(@Valid @RequestBody AgendamentoRequestDTO dto) {
        AgendamentoResponseDTO response = agendamentoService.solicitarAgendamento(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar agendamentos (Meus Agendamentos)")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarMeusAgendamentos() {
        List<AgendamentoResponseDTO> response = agendamentoService.listarMeusAgendamentos();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status do agendamento (Confirmar/Finalizar/Cancelar)")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id,
            @RequestParam AgendamentoStatus status) {
        // Simple dispatch based on status param.
        // Ideally we could have a specific DTO or separate endpoints, but this works
        // for the prompt.
        switch (status) {
            case CONFIRMADO:
                agendamentoService.confirmarAgendamento(id);
                break;
            case REALIZADO:
                agendamentoService.finalizarAtendimento(id);
                break;
            case CANCELADO:
                agendamentoService.cancelarAgendamento(id);
                break;
            default:
                // For PENDING or others, do nothing or throw error
                break;
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar agendamento")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        agendamentoService.cancelarAgendamento(id);
        return ResponseEntity.noContent().build();
    }
}
