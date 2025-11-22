package com.vitalis.api.service;

import com.vitalis.api.dto.RequisicaoRequestDTO;
import com.vitalis.api.dto.RequisicaoResponseDTO;
import com.vitalis.api.entity.Requisicao;
import com.vitalis.api.entity.RequisicaoPrioridade;
import com.vitalis.api.entity.RequisicaoStatus;
import com.vitalis.api.repository.RequisicaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequisicaoService {

    private final RequisicaoRepository requisicaoRepository;

    @Transactional
    public RequisicaoResponseDTO criarRequisicao(RequisicaoRequestDTO requestDTO) {
        Requisicao requisicao = Requisicao.builder()
                .titulo(requestDTO.getTitulo())
                .descricao(requestDTO.getDescricao())
                .status(requestDTO.getStatus())
                .prioridade(requestDTO.getPrioridade())
                .solicitante(requestDTO.getSolicitante())
                .build();

        Requisicao saved = requisicaoRepository.save(requisicao);
        return toResponseDTO(saved);
    }

    public List<RequisicaoResponseDTO> listarTodas() {
        return requisicaoRepository.findByOrderByDataCriacaoDesc().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public RequisicaoResponseDTO buscarPorId(Long id) {
        Requisicao requisicao = requisicaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requisição não encontrada com id: " + id));
        return toResponseDTO(requisicao);
    }

    public List<RequisicaoResponseDTO> buscarPorStatus(RequisicaoStatus status) {
        return requisicaoRepository.findByStatus(status).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<RequisicaoResponseDTO> buscarPorPrioridade(RequisicaoPrioridade prioridade) {
        return requisicaoRepository.findByPrioridade(prioridade).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RequisicaoResponseDTO atualizarRequisicao(Long id, RequisicaoRequestDTO requestDTO) {
        Requisicao requisicao = requisicaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requisição não encontrada com id: " + id));

        requisicao.setTitulo(requestDTO.getTitulo());
        requisicao.setDescricao(requestDTO.getDescricao());
        requisicao.setStatus(requestDTO.getStatus());
        requisicao.setPrioridade(requestDTO.getPrioridade());
        requisicao.setSolicitante(requestDTO.getSolicitante());

        Requisicao updated = requisicaoRepository.save(requisicao);
        return toResponseDTO(updated);
    }

    @Transactional
    public RequisicaoResponseDTO atualizarStatus(Long id, RequisicaoStatus novoStatus) {
        Requisicao requisicao = requisicaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requisição não encontrada com id: " + id));

        requisicao.setStatus(novoStatus);
        Requisicao updated = requisicaoRepository.save(requisicao);
        return toResponseDTO(updated);
    }

    @Transactional
    public void deletarRequisicao(Long id) {
        if (!requisicaoRepository.existsById(id)) {
            throw new RuntimeException("Requisição não encontrada com id: " + id);
        }
        requisicaoRepository.deleteById(id);
    }

    private RequisicaoResponseDTO toResponseDTO(Requisicao requisicao) {
        return RequisicaoResponseDTO.builder()
                .id(requisicao.getId())
                .titulo(requisicao.getTitulo())
                .descricao(requisicao.getDescricao())
                .status(requisicao.getStatus())
                .prioridade(requisicao.getPrioridade())
                .solicitante(requisicao.getSolicitante())
                .dataCriacao(requisicao.getDataCriacao())
                .dataAtualizacao(requisicao.getDataAtualizacao())
                .build();
    }
}
