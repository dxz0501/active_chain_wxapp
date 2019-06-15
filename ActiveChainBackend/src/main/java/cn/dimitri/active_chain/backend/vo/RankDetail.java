package cn.dimitri.active_chain.backend.vo;

import cn.dimitri.active_chain.backend.po.WxUser;

public class RankDetail {
    private WxUser wxUser;
    private RankRes rankRes;

    public WxUser getWxUser() {
        return wxUser;
    }

    public void setWxUser(WxUser wxUser) {
        this.wxUser = wxUser;
    }

    public RankRes getRankRes() {
        return rankRes;
    }

    public void setRankRes(RankRes rankRes) {
        this.rankRes = rankRes;
    }
}
