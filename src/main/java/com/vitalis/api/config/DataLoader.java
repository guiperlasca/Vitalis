package com.vitalis.api.config;

import com.vitalis.api.entity.*;
import com.vitalis.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

        private final UsuarioRepository usuarioRepository;
        private final ClinicaRepository clinicaRepository;
        private final PacienteRepository pacienteRepository;
        private final ProcedimentoRepository procedimentoRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                if (usuarioRepository.count() > 0) {
                        return; // Data already loaded
                }

                // 1. Admin
                Usuario admin = Usuario.builder()
                                .nome("Admin Vitalis")
                                .email("admin@vitalis.com")
                                .senha(passwordEncoder.encode("admin123"))
                                .role(UserRole.ROLE_ADMIN)
                                .ativo(true)
                                .dataCriacao(LocalDateTime.now())
                                .build();
                usuarioRepository.save(admin);

                // 2. Clínicas
                Clinica vitalisCardio = Clinica.builder()
                                .nomeFantasia("Vitalis Cardio")
                                .razaoSocial("Vitalis Cardiologia LTDA")
                                .especialidade("Cardiologia")
                                .endereco("Av. Paulista, 1000")
                                .avaliacao(4.8)
                                .ativo(true)
                                .dataCriacao(LocalDateTime.now())
                                .build();
                clinicaRepository.save(vitalisCardio);

                // Create User for Clinic
                Usuario userCardio = Usuario.builder()
                                .nome("Vitalis Cardio User")
                                .email("contato@vitaliscardio.com")
                                .senha(passwordEncoder.encode("senha123"))
                                .role(UserRole.ROLE_CLINICA)
                                .ativo(true)
                                .dataCriacao(LocalDateTime.now())
                                .build();
                usuarioRepository.save(userCardio);

                Clinica clinicaFamilia = Clinica.builder()
                                .nomeFantasia("Clínica da Família")
                                .razaoSocial("Saúde Família S/A")
                                .especialidade("Clínica Geral")
                                .endereco("Rua das Flores, 500")
                                .avaliacao(4.5)
                                .ativo(true)
                                .dataCriacao(LocalDateTime.now())
                                .build();
                clinicaRepository.save(clinicaFamilia);

                // 3. Procedimentos
                Procedimento consultaCardio = Procedimento.builder()
                                .nome("Consulta Cardiológica")
                                .descricao("Consulta completa com especialista")
                                .preco(new BigDecimal("350.00"))
                                .duracaoEstimadaMinutos(45)
                                .disponivel(true)
                                .clinica(vitalisCardio)
                                .build();

                Procedimento eletro = Procedimento.builder()
                                .nome("Eletrocardiograma")
                                .descricao("Exame do coração em repouso")
                                .preco(new BigDecimal("150.00"))
                                .duracaoEstimadaMinutos(20)
                                .disponivel(true)
                                .clinica(vitalisCardio)
                                .build();

                Procedimento consultaGeral = Procedimento.builder()
                                .nome("Consulta Geral")
                                .descricao("Atendimento primário")
                                .preco(new BigDecimal("120.00"))
                                .duracaoEstimadaMinutos(30)
                                .disponivel(true)
                                .clinica(clinicaFamilia)
                                .build();

                Procedimento hemograma = Procedimento.builder()
                                .nome("Hemograma Completo")
                                .descricao("Exame de sangue")
                                .preco(new BigDecimal("50.00"))
                                .duracaoEstimadaMinutos(10)
                                .disponivel(true)
                                .clinica(clinicaFamilia)
                                .build();

                Procedimento raioX = Procedimento.builder()
                                .nome("Raio-X Torax")
                                .descricao("Radiografia digital")
                                .preco(new BigDecimal("180.00"))
                                .duracaoEstimadaMinutos(15)
                                .disponivel(true)
                                .clinica(clinicaFamilia)
                                .build();

                procedimentoRepository.saveAll(Arrays.asList(consultaCardio, eletro, consultaGeral, hemograma, raioX));

                // 4. Pacientes
                Usuario userPaciente1 = Usuario.builder()
                                .nome("João Silva")
                                .email("joao@email.com")
                                .senha(passwordEncoder.encode("paciente123"))
                                .role(UserRole.ROLE_PACIENTE)
                                .ativo(true)
                                .dataCriacao(LocalDateTime.now())
                                .build();
                usuarioRepository.save(userPaciente1);

                Paciente paciente1 = Paciente.builder()
                                .nome("João Silva")
                                .cpf("123.456.789-00")
                                .email("joao@email.com")
                                .telefone("11999999999")
                                .dataNascimento(java.time.LocalDate.of(1985, 5, 20))
                                .ativo(true)
                                .dataCriacao(LocalDateTime.now())
                                .build();
                pacienteRepository.save(paciente1);

                Usuario userPaciente2 = Usuario.builder()
                                .nome("Maria Oliveira")
                                .email("maria@email.com")
                                .senha(passwordEncoder.encode("paciente123"))
                                .role(UserRole.ROLE_PACIENTE)
                                .ativo(true)
                                .dataCriacao(LocalDateTime.now())
                                .build();
                usuarioRepository.save(userPaciente2);

                Paciente paciente2 = Paciente.builder()
                                .nome("Maria Oliveira")
                                .cpf("987.654.321-11")
                                .email("maria@email.com")
                                .telefone("11988888888")
                                .dataNascimento(java.time.LocalDate.of(1990, 8, 15))
                                .ativo(true)
                                .dataCriacao(LocalDateTime.now())
                                .build();
                pacienteRepository.save(paciente2);

                System.out.println("--- DADOS DE TESTE CARREGADOS COM SUCESSO ---");
        }
}
