package com.vitalis.api.repository;

import com.vitalis.api.entity.Requisicao;
import com.vitalis.api.entity.RequisicaoPrioridade;
import com.vitalis.api.entity.RequisicaoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequisicaoRepository extends JpaRepository<Requisicao, Long> {

    List<Requisicao> findByStatus(RequisicaoStatus status);

    List<Requisicao> findByPrioridade(RequisicaoPrioridade prioridade);

    List<Requisicao> findByStatusAndPrioridade(RequisicaoStatus status, RequisicaoPrioridade prioridade);

    List<Requisicao> findByOrderByDataCriacaoDesc();
}
