package cn.dimitri.active_chain.backend.vo;

import cn.dimitri.active_chain.backend.po.AcInfo;

public class AcInfoRes {
    private AcInfo info;
    private double marking;

    public AcInfo getInfo() {
        return info;
    }

    public void setInfo(AcInfo info) {
        this.info = info;
    }

    public double getMarking() {
        return marking;
    }

    public void setMarking(double marking) {
        this.marking = marking;
    }
}
