package com.k4ktyc.bustickets.config;

import com.k4ktyc.bustickets.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authProvider());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                    .antMatchers("/css/**", "/js/**", "/img/**").permitAll()
                    .antMatchers("/", "/home.html", "/api/checkAuth").permitAll()
                    .antMatchers("/trips", "/trips/*", "/api/trips", "/api/trips/search").permitAll()
                    .antMatchers("/api/register", "/login").anonymous()
                    .antMatchers("/admin", "/api/admin/*").hasRole("ADMIN")
                    .anyRequest().authenticated()
                    .and()
                .formLogin()
                    .loginPage("/?needLogin")
                    .loginProcessingUrl("/login")
                    .defaultSuccessUrl("/")
                    .failureUrl("/?error")
                    .and()
                .rememberMe()
                    .key("thumbup")
                    .userDetailsService(userService)
                    .and()
                .logout()
                    .deleteCookies("JSESSIONID")
                    .logoutSuccessUrl("/")
                    .and()
                .csrf().disable();
    }

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(getPasswordEncoder());
        return authProvider;
    }
}
