package com.bluecrew.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bluecrew.api.model.Usuario;
import com.bluecrew.api.repository.UsuarioRepository;
import com.bluecrew.api.repository.InscripcionesRepository;
import com.bluecrew.api.repository.CalificacionRepository;
import com.bluecrew.api.repository.EventoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UsuarioService {
    @Autowired
    public UsuarioRepository usuarioRepository;

    @Autowired
    private InscripcionesRepository inscripcionesRepository;

    @Autowired
    private CalificacionRepository calificacionRepository;

    @Autowired
    private EventoRepository eventoRepository;


   
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Transactional(readOnly = true)
    public Usuario login(String email, String passwordPlano) {
       
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
          
            if (passwordEncoder.matches(passwordPlano, usuario.getPassword_hash())) {
                return usuario; 
            }
        }
        return null;
    }
    
    // ************************
    // CONSULTAS
    // ************************  
    @Transactional(readOnly = true) 
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Transactional(readOnly = true) 
    public Usuario findById(int id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true) 
    public Long count() {
        return usuarioRepository.count();
    } 

    @Transactional(readOnly = true) 
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Transactional(readOnly = true) 
    public Long countActivos() {
        return usuarioRepository.countSqlActivos();
    }
    
    // ************************
    // ACTUALIZACIONES
    // ************************  
    @Transactional
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    @Transactional
    public Usuario update(int id, Usuario usuarioDetails) {
        Usuario usuario = findById(id);
        usuario.setRol(usuarioDetails.getRol());
        usuario.setNombre(usuarioDetails.getNombre());
        usuario.setApellido(usuarioDetails.getApellido());
        usuario.setEmail(usuarioDetails.getEmail());
        usuario.setBiografia(usuarioDetails.getBiografia());

        if (usuarioDetails.getFoto() != null) {
             usuario.setFoto(usuarioDetails.getFoto());
        }
        return usuarioRepository.save(usuario);
    }
    
    @Transactional
    public void deleteById(int id) {
        eventoRepository.setUsuarioToNull(id);
        calificacionRepository.deleteByUsuarioId(id);
        inscripcionesRepository.deleteByUsuarioId(id);
        usuarioRepository.deleteById(id);
    }    
}
