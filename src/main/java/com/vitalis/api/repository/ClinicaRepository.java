package com.vitalis.api.repository;

import com.vitalis.api.entity.Clinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicaRepository extends JpaRepository<Clinica, Long> {
    List<Clinica> findByNomeFantasiaContainingIgnoreCase(String nomeFantasia);

    List<Clinica> findByEspecialidadeIgnoreCase(String especialidade);
}
