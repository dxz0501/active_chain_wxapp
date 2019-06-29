package cn.dimitri.active_chain.backend.ctrlr;

import cn.dimitri.active_chain.backend.biz.WxAPIService;
import cn.dimitri.active_chain.backend.vo.WxUserSession;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/")
public class IndexCtrlr {

    private final WxAPIService wxAPIService;

    @Autowired
    public IndexCtrlr(WxAPIService wxAPIService) {
        this.wxAPIService = wxAPIService;
    }

    @RequestMapping(value="/")
    public String index(){
        return "ActiveChain Service is Ready !";
    }

    @RequestMapping(value="/wxauth/{userCode}")
    public WxUserSession wxAuth(@PathVariable("userCode") String userCode){
        return  wxAPIService.handleUserSessionCode(userCode);
    }
}
