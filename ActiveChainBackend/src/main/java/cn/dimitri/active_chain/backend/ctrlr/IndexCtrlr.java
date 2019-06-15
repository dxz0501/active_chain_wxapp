package cn.dimitri.active_chain.backend.ctrlr;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/")
public class IndexCtrlr {

    @RequestMapping(value="/")
    public String index(){
        return "ActiveChain Service is Ready !";
    }
}
