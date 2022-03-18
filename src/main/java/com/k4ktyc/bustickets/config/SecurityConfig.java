package com.k4ktyc.bustickets.config;

import com.k4ktyc.bustickets.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
public class SecurityConfig {

    @Bean
    public static PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @EnableWebSecurity
    public static class WebSecurityConfig extends WebSecurityConfigurerAdapter {

        private UserService userService;

        @Autowired
        public void setUserService(UserService userService) {
            this.userService = userService;
        }


        @Override
        protected void configure(AuthenticationManagerBuilder auth) {
            auth.authenticationProvider(authProvider());
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .authorizeRequests()
                    .antMatchers("/css/**", "/js/**", "/img/**").permitAll()
                    .antMatchers("/", "/home.html").permitAll()
                    .antMatchers(HttpMethod.GET, "/trips/**", "/api/trips/**").permitAll()
                    .antMatchers(HttpMethod.POST, "/api/orders").hasAnyRole("USER", "EMPLOYEE")  // TODO: запретить админу только создание заказа
                    .antMatchers("/orders/**").hasAnyRole("ADMIN", "EMPLOYEE")
                    .antMatchers("/api/register", "/login").anonymous()
                    .antMatchers("/admin/**", "/api/admin/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
                    .and()
                    .formLogin()
                    .loginPage("/?needLogin")
                    .loginProcessingUrl("/login")
                    .successHandler(successHandler())
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
        public DaoAuthenticationProvider authProvider() {
            DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
            authProvider.setUserDetailsService(userService);
            authProvider.setPasswordEncoder(getPasswordEncoder());
            return authProvider;
        }

        @Bean
        public AuthenticationSuccessHandler successHandler() {
            return new CustomLoginSuccessHandler("/");
        }
    }
}
