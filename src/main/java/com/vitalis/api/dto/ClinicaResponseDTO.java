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
public class ClinicaResponseDTO {
    private Long id;
    private String nomeFantasia;
    private String razaoSocial;
    private String especialidade;
    private String endereco;
    private Double avaliacao;
    private boolean ativo;
    private LocalDateTime dataCriacao;
}
