package com.vitalis.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String endereco;
    private String historicoMedico;
    private boolean ativo;
    private LocalDateTime dataCriacao;
}
