package cn.dimitri.active_chain.backend.ctrlr;

import cn.dimitri.active_chain.backend.po.WxUser;
import cn.dimitri.active_chain.backend.vo.OpeRet;
import org.springframework.beans.factory.annotation.Autowired;
import cn.dimitri.active_chain.backend.biz.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value="/user")
public class UserCtrlr {
    private final UserService userService;

    @Autowired
    public UserCtrlr(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value="/query/{wxUid}")
    public WxUser queryUser(@PathVariable(name = "wxUid") String wxUid){
        return userService.selectUser(wxUid);
    }

    @PostMapping(value="/update")
    public OpeRet addUser(@RequestBody WxUser wxUser){
        OpeRet ret = new OpeRet();
        ret.setRes(userService.insertOrUpdateUser(wxUser));
        return ret;
    }

}
