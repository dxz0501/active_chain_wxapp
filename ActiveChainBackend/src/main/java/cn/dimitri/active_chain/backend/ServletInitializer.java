package cn.dimitri.active_chain.backend;

import cn.dimitri.active_chain.backend.AcBackendServApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(AcBackendServApplication.class);
    }

}
