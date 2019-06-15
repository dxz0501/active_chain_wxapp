package cn.dimitri.active_chain.backend.ctrlr;

import cn.dimitri.active_chain.backend.biz.AcInfoService;
import cn.dimitri.active_chain.backend.po.AcInfo;
import cn.dimitri.active_chain.backend.vo.AcInfoRes;
import cn.dimitri.active_chain.backend.vo.OpeRet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value="/info")
public class InfoCtrlr {
    private final AcInfoService acInfoService;

    @Autowired
    public InfoCtrlr(AcInfoService acInfoService) {
        this.acInfoService = acInfoService;
    }

    @RequestMapping(value="/query/{wxUid}/{sDate}/{tDate}")
    public List<AcInfoRes> queryInfo(@PathVariable(name = "wxUid") String wxUid,
                                     @PathVariable(name = "sDate") String sDate,
                                     @PathVariable(name = "tDate") String tDate){
        return acInfoService.getInfoRecords(wxUid, sDate, tDate);
    }

    @PostMapping(value="/add")
    public OpeRet addInfo(@RequestBody AcInfo acInfo){
        OpeRet ret = new OpeRet();
        ret.setRes(acInfoService.insertInfo(acInfo));
        return ret;
    }

    @RequestMapping(value="/delete/{sid}")
    public OpeRet delInfo(@PathVariable(name = "sid") long sid){
        OpeRet ret = new OpeRet();
        ret.setRes(acInfoService.deleteInfo(sid));
        return ret;
    }
}
