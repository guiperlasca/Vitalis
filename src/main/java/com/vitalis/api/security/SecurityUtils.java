package com.vitalis.api.security;

import com.vitalis.api.entity.UserRole;
import com.vitalis.api.entity.Usuario;
import com.vitalis.api.exception.EntityNotFoundException;
import com.vitalis.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UsuarioRepository usuarioRepository;

    public Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new EntityNotFoundException("Usuário não autenticado no contexto de segurança.");
        }

        String email = authentication.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + email));
    }

    public boolean isAdmin() {
        Usuario user = getCurrentUser();
        return user.getRole() == UserRole.ROLE_ADMIN;
    }

    // Exemplo de verificação de dono de clínica (lógica simplificada, precisaria
    // relacionar Usuario com Clinica)
    // Como ainda não temos o relacionamento direto Usuario -> Clinica (apenas
    // roles), deixo o esqueleto.
    public boolean isDonoDaClinica(Long clinicaId) {
        Usuario user = getCurrentUser();
        // TODO: Implementar lógica real verificando se o usuário é dono da clínica ID
        return user.getRole() == UserRole.ROLE_CLINICA;
    }
}
