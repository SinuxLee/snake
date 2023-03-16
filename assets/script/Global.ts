const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.Component)
    public DataManager = null;

    @property(cc.Component)
    public SoundManager = null;

    @property(cc.Component)
    public UIManager = null;

    @property(cc.Component)
    public Game = null;

    @property(cc.Component)
    public Net = null;

    @property(cc.Component)
    public WeiXinPlatform = null;

    private NameList: string[] = [];
    private IsSingleMode = true;
    private localStorage = cc.sys.localStorage;
    private GameVersion = "1.0.0";

    onLoad() {
        this.DataManager = cc.find("DataManager").getComponent("DataManager")
        this.SoundManager = cc.find("SoundManager").getComponent("SoundManager")
        this.UIManager = cc.find("Canvas/UIManager").getComponent("UIManager")
        this.Game = cc.find("Game").getComponent("Game")
        this.Net = cc.find("Net").getComponent("Net")
        this.WeiXinPlatform = cc.find("WeiXinPlatform").getComponent("WeiXinPlatform")
        this.NameList = [
            "大道至简", "知名投资人", "刘经理", "独自等待", "厌世症", "刘晓霞", "人心可畏", "知心人", "济水上苑物业小王",
            "可喜可乐", "冯静", "以心换心", "大海", "渣中王?", "一干为尽", "中兴产品部", "就是任性", "渣渣辉", "无敌的寂寞",
            "住进时光里", "王强", "搬家小王", "只为你生！", "前后都是你", "陌离女王", "缺我也没差", "十年温如初",
            "齐鲁楼市资深顾问", "闹够了就滚", "单身女王", "有刺的猬", "爱情就是难题", "小猪短租", "国名小逗比！",
            "木槿七七", "脾气酸独与你温柔", "逆风K人头", "Dota一姐", "我脑残我乐意", "中宏保险娜娜", "天之殇",
            "小心翼翼", "妲己再美终是妃", "虚伪了的真心", "簡單灬愛", "一生承诺", "给我五厘米的高度", "美美的校霸花",
            "枪蹦狗友 .", "你是我的幸运儿", "莫名的青春", "深爱是场谋杀。", "你的肥皂掉了", "为梦喧闹只为你", "装逼不适合你",
            "隔壁王学长;", "王欣怡的妈妈", "往事讽刺笑到肚疼", "防御塔", "姐的拽、你不懂", "众人皆醉我独醒", "So Far So Easy",
            "失我者永失", "似水流年", "怎样自在怎样活", "初心以败", "浮生似水", "安静看泪落下", "培智小学高玩", "一辈子都当女超人、",
            "邱处机", "带我装逼带我飞", "没资本就别装纯", "我一贱你就笑", "王怡欣", "没刘海照样拽i", "济南老兵搬家", "出租车李亮",
            "我想请你次辣条!", "醉酒笑红颜灬", "默默的付出、", "时光凉透初时模样。", "旧时光她是个美人", "不过一个她", "默默的离开。",
            "分开走", "奥利奥╮", "这辈子赖定你了", "蘑菇乖乖", "默默的承受、", "伤了我却不让我走i", "蛋疼先森", "张亮麻辣烫",
            "执笔秀贞操", "智商╮偏。", "长欢尽", "爱我所爱", "Cook Islands", "Costa Rica", "Cote D'ivoire", "舵手", "冷月葬魂",
            "冷暖自知ら", "今日我便是女王", "我姓黄我心慌！", "纣王偏宠妲己妖", "爱情自以为是", "一直被模仿", "就是这头禽兽", "老表，你好野",
            "对半感情", "未来被时间冷藏", "Equatorial Guinea", "很有粪量的人", "不爱又何必纠缠", "早已▲沧海桑田", "亲一口", "简单灬爱",
            "那時\xb0年少", "哥只抽乀寂寞", "东北菜馆正丰路", "一个冷笑话", "孤身走天涯 ", "伤了我却不让我走i", "言己", "陕西肉夹膜",
            "拼尽所有得到了什么", "没人看过我发的网名", "虚 张 声 势丶", "石头剪子布", "习惯", "时光待我替他安好i", "请原谅我不会说谎i",
            "__没有背景丶只有背影", "石头队长再见了", "帅气不打烊", "时光待我替他安好i", "喜欢安静却讨厌寂寞", "天青色等烟雨.", "胡晓晓",
            "一世妖娆", "原谅我放开你的手i", "我知道你深爱她 *", "穿越古代", "你把矫情当成爱情", "心痛直至消逝", "何必再忆", "墨染孤舟",
            "森屿海巷", "鲸蓝旧巷", "誮開一夏", "少了一个自己的自己", "勿念心安。", "你可知 时间不等人", "中单小霸王", "仅有的的回忆、曾经",
            "江宇鑫 我喜欢你i", "绝望压抑我无法呼吸", "久伴我还是酒伴我i", "爱是寂寞说的谎 ミ", "柠檬落泪总是酸 i", "喜你人多怪我懦弱i",
            "人潮拥挤你该远离i", "你不会遇见第二个我", "容我爱你深不见底", "时光叫我别想他", "我爱你", "既然无缘", "来自星星的qq网名",
            "亡者为胜", "狼的传奇", "稳准狠", "铁拳★战士", "流年、獨殤", "紫陌≈紅塵", "嘘！听屁在歌唱", "╰流年已逝╮", "念念不忘丶",
            "邪殿單身", "鬼血", "浮生若梦ァ", "神经兮兮\xb0", "减肥李旭", "莫泆莫忘", "一 念 执 著", "万众金牌女神", "流星飒沓",
            "吧唧吧唧", "A000玛酷教育", "酸甜柚子", "查无此人゛", "分开也不一定分手", "唱不出离伤", "骚年求逆推", "虎头", "独行少女",
            "唐僧家的悟空哥哥", "半糖主義", "雨dē印記", "堕落灬你不配", "女汉走天下", "旧日巴黎﹏", "万能男神经i", "北京去看海", "煙花易涼。",
            "夜的第七章", "蜡笔没有小新", "独守空城", "坐在坟地看星星", "三寸日光\xa4", "花非花的格调", "夜场.燕子", "素年凉音", "猫腻菇凉",
            "Saudi Arabia", "楚狼天歌 *", "夜无边", "王者.巅峰", "王者绝非偶然", "陌落ミ繁華﹏", "瑶冰魄。", "自欺欺人", "Solomon Islands",
            "影魅", "South Africa", "花落な莫离い", "沽酒杯空影", "没有蛀牙", "望春风", "一天一日 一日一天", "魔鬼先森", "在时光里曾遇你",
            "安颜如夏", "皇冠属于女王", "天意弄人", "斗破粉丝", "不爱就杀", "覆水难收╰", "花折亦无情", "岁月成沧海", "陌路离殇℡", "傲气独走生",
            "童心未泯", "月牙小淑女", "安之若素", "辣条小仙女", "点到为止", "冷魅", "間間單單ヾ", "不敢恋人", "倾謦心雨泪", "卑微旳嗳", "舞池",
            "不爱我？滚！", "花季末了", "Viet Nam", "怂到爆再吃药", "冰魄", "青衫烟雨", "浅心蓝染△", "迷糊的小九", "神经兮兮\xb0", "墨羽尘曦",
            "私定终生", "逝者如斯夫", "﹏诉丶那鍛綪", "火星人", "墳場做戲﹏", "ˊ命鍾鉒顁。", "半醉〞巴黎づ", "果冻布丁℃", "毁了 悔了", "一紙荒年",
            "薄暮凉年∞", "櫻婲の涙", "此号已封", "魔咒", "那紧扣的指尖", "朝夕相处", "行尸走肉 ", "旧 情 未 了 ", "゛浮殇若梦╮", "じ浮浮沉沉☆ ",
            "暗空之靈 ", "空城旧颜\xb0 ", "念我旧时裳 ", "尐貓咪咪", "三好先森 ", "正二8紧 ", "麦芽糖糖ぴ ", "心软是病夺我命", "蝴蝶尖叫",
            "浅夏﹌初凉 ", "心力憔悴〤 ", "哥的寂寞、谁能懂", "夏至ゝ未至", "緦唸λ蓇 ", "别那么骄傲", "天使の眼泪", ".\xb7☆蝶舞飛揚☆\xb7. ",
            "森北； ", "无人街角", "笙清初扇离 ", "摇滚枷锁", "本人已屎", "故作堅強\xb7不離不棄", "守一座空城", "屁颠屁颠", "老子叫甜甜",
            "∝逢床作戏", "旧人成梦", "浮浮沉沉", "So丶各自安好", "顺萁咱然丶", "流氓先森〃", "极度深寒", "紫蝶之纞", "安然失笑ゝ", "Garbage Can Lid",
            "迩媞壞銀", "梦醒时分", "ヾ︷浅色年华", "嘘！安静点", "不痛不癢≈", "洞房不败~", "努力灬奋斗", "老金烧烤盛景店", "孤獨患者", "不许揪我小耳朵",
            "ぃ绣滊泡泡℃", "嘟嘟糖果", "晴天。小曦", "一季花开ˇ", "1/2的愛情", "夏殤\xa4落樱", "蜡笔小旧", "爲 迩 封 鈊", "小嘴欠吻", "花骨朵er",
            "阴月下的墓碑", "浅笑ヽ微凉", "小饭团", "清酒孤歌", "倾城之夏", "巡山小妖精", "情 比 紙 薄", "╰素顔小姐", "柚子味绿茶", "半夏时光", "思念成瘾",
            "甯缺勿濫丶", "浅陌凉汐﹋", "「似水流年」\xb0", "太浪淘沙", "爲愛癡狂", "浮游时光", "心如死灰゛", "绿芜", "VR加盟商", "岁月不待人", "旧人不覆",
            "╰╮強顔歡笑", "落盡殘殇", "米熙小夏", "人小鬼大", "从小立志当贱客", "帅气飞舞杀", "笑到心疼", "独奏ヽ 情歌", "迷乱浮生﹡", "冷暖自知", "王大雷",
            "娇小姐", "半夢__半醒", "夏末未了\xb0", "傻傻滴拥着迩", "长发菇凉~", "模糊不清", "刪蒢ゝ鐹呿 ", "少儿编程路老师", "﹏繁花\xb0似景", "浅浅dē伤",
            "只怪自己太年轻", "来往不逢人", "踽踽独行", "一無所冇", "無處葬心", "深海未眠", "大姨妈红遍天下", "劳资拽你管不着", "花凌若别离", "小橘酱",
            "爱君君不知", "隐形于败杀之中", "寂寞求陪", "夏日的綠色", "半生风雪", "是梦终会醒", "繁复’", "杯中酒，鸳鸯情。", "旧事今言", "小乔",
            "曾经飞蛾扑火", "情逝如斯祭流年\xb0", "麦霸", "你不爱我、但我爱你", "结发青梅", "婚姻终结者", "聚散如烟", "陪伴胜过思念", "╰华灯初上、旧人可安",
            "一季浅舞", "有些秘密不能说", "乱的很有节奏ゆ", "小子，你不配", "殇痕已褪", "半醉半昏半醒", "大货出租", "惯饮孤独", "柚子半夏",
            "倾城一笑，抵我半壁江山、", "帅气范儿", "芳芳", "风神的诺言", "李亮", "-我在地狱仰望天堂", "这年头、寂寞", "人情薄如纸", "张启", "冷风湮没",
            "揍性", "最美的痕迹叫回忆", "老袁", "糕富帅", "愛上╮寂寞", "柠檬心", "樱花树下、那纯美一笑", "分开也不一定分手", "为了五块钱", "天空的颜色狠蓝",
            "橘温茶暖", "柠栀", "清晨的小鹿", "王厚磊", "掌心温差", "萌爹爹", "徒留一场笑谈一场心伤", "Twisted Fate", "玫瑰香旳誘惑", "女王(Queen)ゆ性",
            "爱情有保质期", "魔力小王子", "王欣"
        ]

        window.GameGlobal = this
    }

    getRandomNameList(num: number, t: string[]) {
        const len = this.NameList.length;

        const n = Math.floor(len / num)
        for (let r = 0; r < num; ++r) {
            const idx = Math.floor(n * r + Math.random() * n);
            if (idx >= 0 && idx < len) t.push(this.NameList[idx])
        }
    }
}
