package com.vitalis.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedimentoRequestDTO {

    @NotBlank(message = "O nome do procedimento é obrigatório")
    private String nome;

    private String descricao;

    @NotNull(message = "O preço é obrigatório")
    private BigDecimal preco;

    @NotNull(message = "A duração estimada é obrigatória")
    private Integer duracaoEstimadaMinutos;

    private boolean disponivel = true;

    @NotNull(message = "O ID da clínica é obrigatório")
    private Long clinicaId;
}
