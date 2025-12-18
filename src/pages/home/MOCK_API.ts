import type { PostResponse } from './api';

export const MOCK_POSTS: PostResponse = {
    posts: [
        {
            id: 1,
            title: '深圳大学图书馆真的太美了！',
            text: '今天在图书馆学习了一整天，发现图书馆的落地窗外景色真的很棒。秋天的阳光透过玻璃洒进来，特别适合学习。推荐大家来五楼靠窗的位置，视野超好！',
            media: [
                {
                    url: 'https://picsum.photos/800/600?random=1',
                    type: 'image',
                },
                {
                    url: 'https://picsum.photos/800/600?random=2',
                    type: 'image',
                },
            ],
            tags: ['校园生活', '图书馆', '学习'],
            created_at: Date.now() - 1000 * 60 * 30, // 30分钟前
            updated_at: Date.now() - 1000 * 60 * 30,
            author: {
                id: 101,
                name: '小明同学',
                avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            },
            status: {
                comment_count: 23,
                like_count: 156,
                share_count: 12,
            },
        },
        {
            id: 2,
            title: '今天食堂新出的菜品真不错！',
            text: '二楼食堂今天推出了新的川菜窗口，麻婆豆腐和回锅肉味道都很正宗，价格也实惠。强烈推荐给喜欢吃辣的同学们！',
            media: [
                {
                    url: 'https://picsum.photos/800/600?random=3',
                    type: 'image',
                },
            ],
            tags: ['美食', '食堂', '推荐'],
            created_at: Date.now() - 1000 * 60 * 60 * 2, // 2小时前
            updated_at: Date.now() - 1000 * 60 * 60 * 2,
            author: {
                id: 102,
                name: '吃货小红',
                avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            },
            status: {
                comment_count: 45,
                like_count: 289,
                share_count: 31,
            },
        },
        {
            id: 3,
            title: '校园运动会精彩瞬间',
            text: '今天参加了学院的运动会，氛围超级棒！大家都很拼，为班级争光。虽然我只是跑了个接力赛，但是真的很开心。看到同学们在赛场上的拼搏精神，感觉青春就应该是这样！',
            media: [
                {
                    url: 'https://picsum.photos/800/600?random=4',
                    type: 'video',
                },
            ],
            tags: ['运动会', '校园活动', '青春'],
            created_at: Date.now() - 1000 * 60 * 60 * 5, // 5小时前
            updated_at: Date.now() - 1000 * 60 * 60 * 5,
            author: {
                id: 103,
                name: '运动健将',
                avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
            },
            status: {
                comment_count: 67,
                like_count: 423,
                share_count: 28,
            },
        },
        {
            id: 4,
            title: '分享一个超实用的学习方法',
            text: '最近发现了一个提高学习效率的好方法：番茄工作法。每学习25分钟休息5分钟，4个番茄钟后休息15-30分钟。这样不容易疲劳，而且效率还提高了。配合白噪音效果更佳！推荐给期末复习的同学们。',
            media: [],
            tags: ['学习方法', '效率', '期末复习'],
            created_at: Date.now() - 1000 * 60 * 60 * 24, // 1天前
            updated_at: Date.now() - 1000 * 60 * 60 * 24,
            author: {
                id: 104,
                name: '学霸小李',
                avatar: 'https://cube.elemecdn.com/c/5e/5e5e5e5e5e5e5e5e5e5e5e5e5e5epng.png',
            },
            status: {
                comment_count: 91,
                like_count: 567,
                share_count: 143,
            },
        },
        {
            id: 5,
            title: '深圳湾公园周末骑行攻略',
            text: '上周末和朋友们去深圳湾骑行，简直太爽了！海风吹着，看着日落，骑车环游一圈大概2小时。建议大家下午4点左右去，可以看到超美的晚霞。记得带防晒霜和水哦！',
            media: [
                {
                    url: 'https://picsum.photos/800/600?random=5',
                    type: 'image',
                },
                {
                    url: 'https://picsum.photos/800/600?random=6',
                    type: 'image',
                },
                {
                    url: 'https://picsum.photos/800/600?random=7',
                    type: 'image',
                },
            ],
            tags: ['周末活动', '骑行', '深圳湾', '户外'],
            created_at: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2天前
            updated_at: Date.now() - 1000 * 60 * 60 * 24 * 2,
            author: {
                id: 105,
                name: '骑行爱好者',
                avatar: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
            },
            status: {
                comment_count: 34,
                like_count: 298,
                share_count: 56,
            },
        },
        {
            id: 6,
            title: '计算机学院讲座分享',
            text: '今天听了一场关于人工智能的讲座，主讲人是某大厂的技术总监。讲得非常深入浅出，让我对AI的应用有了更深的理解。尤其是关于大模型的部分，感觉未来AI会改变很多行业。强烈建议对技术感兴趣的同学多参加这类讲座！',
            media: [],
            tags: ['讲座', '人工智能', 'AI', '技术分享'],
            created_at: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3天前
            updated_at: Date.now() - 1000 * 60 * 60 * 24 * 3,
            author: {
                id: 106,
                name: '代码小王',
                avatar: 'https://cube.elemecdn.com/a/3f/3990ef257c6c86e142d721f16e10png.png',
            },
            status: {
                comment_count: 52,
                like_count: 384,
                share_count: 67,
            },
        },
        {
            id: 7,
            title: '社团纳新啦！欢迎加入摄影社',
            text: '摄影社开始纳新啦！我们是一个充满热情的团队，定期组织外拍活动，还有专业老师指导。不管你是摄影小白还是大神，都欢迎加入我们。每周六下午都有技术交流会，欢迎来参观！',
            media: [
                {
                    url: 'https://picsum.photos/800/600?random=8',
                    type: 'image',
                },
            ],
            tags: ['社团纳新', '摄影', '校园社团'],
            created_at: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5天前
            updated_at: Date.now() - 1000 * 60 * 60 * 24 * 5,
            author: {
                id: 107,
                name: '摄影社长',
                avatar: 'https://cube.elemecdn.com/b/a4/3c999e8b0a5e7b8b8b8b8b8b8b8png.png',
            },
            status: {
                comment_count: 78,
                like_count: 445,
                share_count: 89,
            },
        },
    ],
    total: 7,
};

