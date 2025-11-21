package com.vitalis.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clinicas")
public class Clinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeFantasia;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false)
    private String especialidade;

    @Column(nullable = false)
    private String endereco;

    private Double avaliacao;

    @Builder.Default
    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    protected void onCreate() {
        this.dataCriacao = LocalDateTime.now();
        if (this.avaliacao == null) {
            this.avaliacao = 0.0;
        }
    }
}
