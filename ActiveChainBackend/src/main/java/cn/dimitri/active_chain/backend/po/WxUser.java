package cn.dimitri.active_chain.backend.po;

public class WxUser {


    private String wxUid;

    private String wxNickname;

    private String uNickname;

    private String wxAvatarurl;

    private int uGender;

    private double uWeight;
    
    private int uPrivacy;

    public WxUser() {
    }

    public String getWxUid() {
        return wxUid;
    }

    public void setWxUid(String wxUid) {
        this.wxUid = wxUid;
    }

    public String getuNickname() {
        return uNickname;
    }

    public void setuNickname(String uNickname) {
        this.uNickname = uNickname;
    }

    public int getuGender() {
        return uGender;
    }

    public void setuGender(int uGender) {
        this.uGender = uGender;
    }

    public double getuWeight() {
        return uWeight;
    }

    public void setuWeight(double uWeight) {
        this.uWeight = uWeight;
    }

    public int getuPrivacy() {
        return uPrivacy;
    }

    public void setuPrivacy(int uPrivacy) {
        this.uPrivacy = uPrivacy;
    }

    public String getWxNickname() {
        return wxNickname;
    }

    public void setWxNickname(String wxNickname) {
        this.wxNickname = wxNickname;
    }

    public String getWxAvatarurl() {
        return wxAvatarurl;
    }

    public void setWxAvatarurl(String wxAvatarurl) {
        this.wxAvatarurl = wxAvatarurl;
    }
}
