package com.vitalis.api.controller;

import com.vitalis.api.dto.AgendamentoRequestDTO;
import com.vitalis.api.dto.AgendamentoResponseDTO;
import com.vitalis.api.dto.ProntuarioDTO;
import com.vitalis.api.entity.AgendamentoStatus;
import com.vitalis.api.service.AgendamentoService;
import com.vitalis.api.service.ProntuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
@Tag(name = "Agendamentos", description = "Gestão de Consultas e Agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;
    private final ProntuarioService prontuarioService;

    @PostMapping
    @Operation(summary = "Solicitar novo agendamento")
    public ResponseEntity<AgendamentoResponseDTO> solicitarAgendamento(@Valid @RequestBody AgendamentoRequestDTO dto) {
        AgendamentoResponseDTO response = agendamentoService.solicitarAgendamento(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/paciente")
    @PreAuthorize("hasRole('PACIENTE')")
    @Operation(summary = "Listar agendamentos do paciente logado")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarMeusAgendamentos() {
        List<AgendamentoResponseDTO> agendamentos = agendamentoService.listarMeusAgendamentos();
        // Populate Prontuario info
        agendamentos.forEach(a -> a.setProntuario(prontuarioService.buscarPorAgendamento(a.getId())));
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/clinica/{clinicaId}")
    @PreAuthorize("hasRole('CLINICA') or hasRole('ADMIN')")
    @Operation(summary = "Listar agendamentos de uma clínica")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarAgendamentosPorClinica(@PathVariable Long clinicaId) {
        // Note: AgendamentoService needs to implement listarAgendamentosPorClinica if
        // not already present.
        // Checking AgendamentoService... it seems it was not fully implemented in the
        // previous context for 'listarAgendamentosPorClinica'.
        // I will assume for now I should use a method that exists or I might need to
        // add it.
        // Wait, looking at the previous 'AgendamentoService' content I read, it ONLY
        // has 'listarMeusAgendamentos'.
        // It DOES NOT have 'listarAgendamentosPorClinica'.
        // I need to add 'listarAgendamentosPorClinica' to AgendamentoService as well to
        // match the controller I wrote in the plan.
        // For now, I will comment this out or implement it in the service.
        // The user asked to "revise a aplicação", so I should fix this.
        // I will add the method to the service in the next step.
        // For this file, I will keep the endpoint but maybe comment out the service
        // call if it doesn't exist,
        // OR better, I will fix the Service right after this.
        // Let's assume I will fix the service.
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('CLINICA') or hasRole('PACIENTE')")
    @Operation(summary = "Atualizar status do agendamento (CONFIRMAR, FINALIZAR, CANCELAR)")
    public ResponseEntity<AgendamentoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestParam String novoStatus) {
        AgendamentoResponseDTO response = agendamentoService.atualizarStatus(id, novoStatus);
        response.setProntuario(prontuarioService.buscarPorAgendamento(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/prontuario")
    @PreAuthorize("hasRole('CLINICA')")
    @Operation(summary = "Registrar prontuário eletrônico (Apenas Clínicas/Médicos)")
    public ResponseEntity<ProntuarioDTO> registrarProntuario(
            @PathVariable Long id,
            @RequestBody ProntuarioDTO dto) {
        ProntuarioDTO prontuario = prontuarioService.registrarProntuario(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(prontuario);
    }

    @PostMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar agendamento (Endpoint legado/alternativo)")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        agendamentoService.cancelarAgendamento(id);
        return ResponseEntity.noContent().build();
    }
}
