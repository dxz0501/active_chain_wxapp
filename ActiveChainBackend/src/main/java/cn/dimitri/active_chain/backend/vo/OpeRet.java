package cn.dimitri.active_chain.backend.vo;

public class OpeRet {
    private boolean res;
    private int needAuth = 0;

    public boolean isRes() {
        return res;
    }

    public void setRes(boolean res) {
        this.res = res;
    }

    public int getNeedAuth() {
        return needAuth;
    }

    public void setNeedAuth(int needAuth) {
        this.needAuth = needAuth;
    }
}
