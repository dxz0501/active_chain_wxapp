package cn.dimitri.active_chain.backend.ctrlr;

import cn.dimitri.active_chain.backend.biz.AcInfoService;
import cn.dimitri.active_chain.backend.biz.UserService;
import cn.dimitri.active_chain.backend.vo.RankDetail;
import cn.dimitri.active_chain.backend.vo.RankRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value="/stat")
public class StatCtrlr {
    private final AcInfoService acInfoService;
    private final UserService userService;

    @Autowired
    public StatCtrlr(AcInfoService acInfoService, UserService userService) {
        this.acInfoService = acInfoService;
        this.userService = userService;
    }

    @RequestMapping(value="/mstat/{wxUid}")
    public RankRes getUserMonthStat(@PathVariable(name = "wxUid") String wxUid){
        return acInfoService.getUserMonthStat(wxUid);
    }

    @RequestMapping(value="/mranklist")
    public List<RankDetail> getUserMonthRankList(){
        return acInfoService.getUserMonthRankDetail();
    }


}
