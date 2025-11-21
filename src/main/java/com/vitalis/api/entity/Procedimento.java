package com.vitalis.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "procedimentos")
public class Procedimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String descricao;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer duracaoEstimadaMinutos;

    @Builder.Default
    @Column(nullable = false)
    private boolean disponivel = true;

    @ManyToOne
    @JoinColumn(name = "clinica_id", nullable = false)
    private Clinica clinica;
}
