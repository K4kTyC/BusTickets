package com.k4ktyc.bustickets.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class CustomLoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    public CustomLoginSuccessHandler(String defaultTargetUrl) {
        setDefaultTargetUrl(defaultTargetUrl);
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        HttpSession session = request.getSession();
        if (session != null) {
            String redirectUrl = request.getHeader("Referer");
            // If request was NOT to /api/ endpoint, redirect url is http://hostname/,
            // and default handler will return previous page
            // e.g. from /trips sent GET to /orders
            //
            // if request was to /api/, user will be redirected to page
            // that sent request
            // e.g. from /trips/1 sent POST to /api/orders
            // (by default handler redirects to /api/orders)
            if (redirectUrl != null) {
                String path = redirectUrl.substring(redirectUrl.lastIndexOf('/') + 1);
                if (!path.isBlank()) {
                    getRedirectStrategy().sendRedirect(request, response, redirectUrl);
                } else {
                    super.onAuthenticationSuccess(request, response, authentication);
                }
            } else {
                super.onAuthenticationSuccess(request, response, authentication);
            }
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
}
