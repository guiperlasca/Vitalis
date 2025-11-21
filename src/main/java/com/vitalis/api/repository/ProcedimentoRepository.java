package com.vitalis.api.repository;

import com.vitalis.api.entity.Procedimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcedimentoRepository extends JpaRepository<Procedimento, Long> {
    List<Procedimento> findByClinicaId(Long clinicaId);
}
