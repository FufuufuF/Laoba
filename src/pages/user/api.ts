import { apiClient } from "@/api/core/client";
import type { ApiResponse } from "@/api/core/types";
import type { UserInfo } from "@/stores/user";
import type { Post } from "@/types/post";

// 是否使用 Mock 数据
const USE_MOCK = true;

// Mock 用户数据
const MOCK_USERS: Record<string, UserInfo> = {
  "101": {
    id: "101",
    username: "2021150001",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    nickname: "小明同学",
    bio: "热爱学习，热爱生活 | 计算机学院 | 大三学生",
    role: "student",
    tags: ["编程", "篮球", "摄影"],
  },
  "102": {
    id: "102",
    username: "2021150002",
    avatar:
      "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    nickname: "吃货小红",
    bio: "美食探索者 | 热爱生活 | 分享校园美食",
    role: "student",
    tags: ["美食", "旅游", "摄影"],
  },
  "103": {
    id: "103",
    username: "2021150003",
    avatar:
      "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
    nickname: "运动健将",
    bio: "体育学院 | 运动达人 | 享受运动的快乐",
    role: "student",
    tags: ["运动", "健身", "跑步"],
  },
  "104": {
    id: "104",
    username: "2021150004",
    avatar:
      "https://cube.elemecdn.com/c/5e/5e5e5e5e5e5e5e5e5e5e5e5e5e5epng.png",
    nickname: "学霸小李",
    bio: "学习使我快乐 | 分享学习方法 | 一起进步",
    role: "student",
    tags: ["学习", "读书", "效率"],
  },
  "105": {
    id: "105",
    username: "2021150005",
    avatar:
      "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
    nickname: "骑行爱好者",
    bio: "用车轮丈量世界 | 骑行社副社长 | 热爱户外",
    role: "student",
    tags: ["骑行", "户外", "旅行"],
  },
  "106": {
    id: "106",
    username: "2021150006",
    avatar:
      "https://cube.elemecdn.com/a/3f/3990ef257c6c86e142d721f16e10png.png",
    nickname: "代码小王",
    bio: "Full Stack Developer | 技术分享者 | 开源爱好者",
    role: "student",
    tags: ["编程", "AI", "技术"],
  },
  "107": {
    id: "107",
    username: "2021150007",
    avatar: "https://cube.elemecdn.com/b/a4/3c999e8b0a5e7b8b8b8b8b8b8b8png.png",
    nickname: "摄影社长",
    bio: "用镜头记录美好 | 摄影社社长 | 欢迎加入",
    role: "student",
    tags: ["摄影", "艺术", "创作"],
  },
};

// Mock 用户帖子数据
const MOCK_USER_POSTS: Record<string, Post[]> = {
  "101": [
    {
      id: 1,
      title: "深圳大学图书馆真的太美了！",
      text: "今天在图书馆学习了一整天，发现图书馆的落地窗外景色真的很棒。秋天的阳光透过玻璃洒进来，特别适合学习。推荐大家来五楼靠窗的位置，视野超好！",
      media: [
        { url: "https://picsum.photos/800/600?random=1", type: "image" },
        { url: "https://picsum.photos/800/600?random=2", type: "image" },
      ],
      tags: ["校园生活", "图书馆", "学习"],
      createAt: Date.now() - 1000 * 60 * 30,
      updateAt: Date.now() - 1000 * 60 * 30,
      author: {
        id: 101,
        name: "小明同学",
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      },
      status: { commentCount: 23, likeCount: 156, shareCount: 12 },
    },
  ],
  "102": [
    {
      id: 2,
      title: "今天食堂新出的菜品真不错！",
      text: "二楼食堂今天推出了新的川菜窗口，麻婆豆腐和回锅肉味道都很正宗，价格也实惠。强烈推荐给喜欢吃辣的同学们！",
      media: [{ url: "https://picsum.photos/800/600?random=3", type: "image" }],
      tags: ["美食", "食堂", "推荐"],
      createAt: Date.now() - 1000 * 60 * 60 * 2,
      updateAt: Date.now() - 1000 * 60 * 60 * 2,
      author: {
        id: 102,
        name: "吃货小红",
        avatar:
          "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      },
      status: { commentCount: 45, likeCount: 289, shareCount: 31 },
    },
    {
      id: 8,
      title: "学校附近的美食推荐",
      text: "整理了一份学校周边的美食地图，有兴趣的同学可以收藏～包含了各种口味的餐厅，人均消费20-50元。",
      media: [
        { url: "https://picsum.photos/800/600?random=11", type: "image" },
        { url: "https://picsum.photos/800/600?random=12", type: "image" },
      ],
      tags: ["美食", "探店", "推荐"],
      createAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      updateAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      author: {
        id: 102,
        name: "吃货小红",
        avatar:
          "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      },
      status: { commentCount: 88, likeCount: 523, shareCount: 76 },
    },
  ],
  "103": [
    {
      id: 3,
      title: "校园运动会精彩瞬间",
      text: "今天参加了学院的运动会，氛围超级棒！大家都很拼，为班级争光。虽然我只是跑了个接力赛，但是真的很开心。看到同学们在赛场上的拼搏精神，感觉青春就应该是这样！",
      media: [{ url: "https://picsum.photos/800/600?random=4", type: "video" }],
      tags: ["运动会", "校园活动", "青春"],
      createAt: Date.now() - 1000 * 60 * 60 * 5,
      updateAt: Date.now() - 1000 * 60 * 60 * 5,
      author: {
        id: 103,
        name: "运动健将",
        avatar:
          "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      },
      status: { commentCount: 67, likeCount: 423, shareCount: 28 },
    },
  ],
  "104": [
    {
      id: 4,
      title: "分享一个超实用的学习方法",
      text: "最近发现了一个提高学习效率的好方法：番茄工作法。每学习25分钟休息5分钟，4个番茄钟后休息15-30分钟。这样不容易疲劳，而且效率还提高了。配合白噪音效果更佳！推荐给期末复习的同学们。",
      media: [],
      tags: ["学习方法", "效率", "期末复习"],
      createAt: Date.now() - 1000 * 60 * 60 * 24,
      updateAt: Date.now() - 1000 * 60 * 60 * 24,
      author: {
        id: 104,
        name: "学霸小李",
        avatar:
          "https://cube.elemecdn.com/c/5e/5e5e5e5e5e5e5e5e5e5e5e5e5e5epng.png",
      },
      status: { commentCount: 91, likeCount: 567, shareCount: 143 },
    },
  ],
  "105": [
    {
      id: 5,
      title: "深圳湾公园周末骑行攻略",
      text: "上周末和朋友们去深圳湾骑行，简直太爽了！海风吹着，看着日落，骑车环游一圈大概2小时。建议大家下午4点左右去，可以看到超美的晚霞。记得带防晒霜和水哦！",
      media: [
        { url: "https://picsum.photos/800/600?random=5", type: "image" },
        { url: "https://picsum.photos/800/600?random=6", type: "image" },
        { url: "https://picsum.photos/800/600?random=7", type: "image" },
      ],
      tags: ["周末活动", "骑行", "深圳湾", "户外"],
      createAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      updateAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      author: {
        id: 105,
        name: "骑行爱好者",
        avatar:
          "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
      },
      status: { commentCount: 34, likeCount: 298, shareCount: 56 },
    },
  ],
  "106": [
    {
      id: 6,
      title: "计算机学院讲座分享",
      text: "今天听了一场关于人工智能的讲座，主讲人是某大厂的技术总监。讲得非常深入浅出，让我对AI的应用有了更深的理解。尤其是关于大模型的部分，感觉未来AI会改变很多行业。强烈建议对技术感兴趣的同学多参加这类讲座！",
      media: [],
      tags: ["讲座", "人工智能", "AI", "技术分享"],
      createAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      updateAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      author: {
        id: 106,
        name: "代码小王",
        avatar:
          "https://cube.elemecdn.com/a/3f/3990ef257c6c86e142d721f16e10png.png",
      },
      status: { commentCount: 52, likeCount: 384, shareCount: 67 },
    },
  ],
  "107": [
    {
      id: 7,
      title: "社团纳新啦！欢迎加入摄影社",
      text: "摄影社开始纳新啦！我们是一个充满热情的团队，定期组织外拍活动，还有专业老师指导。不管你是摄影小白还是大神，都欢迎加入我们。每周六下午都有技术交流会，欢迎来参观！",
      media: [{ url: "https://picsum.photos/800/600?random=8", type: "image" }],
      tags: ["社团纳新", "摄影", "校园社团"],
      createAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
      updateAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
      author: {
        id: 107,
        name: "摄影社长",
        avatar:
          "https://cube.elemecdn.com/b/a4/3c999e8b0a5e7b8b8b8b8b8b8b8png.png",
      },
      status: { commentCount: 78, likeCount: 445, shareCount: 89 },
    },
  ],
};

/**
 * 获取用户信息
 */
export const getUserInfo = async (
  userId: string
): Promise<ApiResponse<UserInfo>> => {
  if (USE_MOCK) {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    const userInfo = MOCK_USERS[userId];
    if (userInfo) {
      return Promise.resolve({
        code: 0,
        message: "success",
        data: userInfo,
      });
    } else {
      return Promise.reject({
        code: 404,
        message: "用户不存在",
        data: null,
      });
    }
  }

  return apiClient.get(`/users/${userId}`);
};

/**
 * 获取用户发布的帖子列表
 */
export const getUserPosts = async (
  userId: string,
  page = 1,
  pageSize = 20
): Promise<
  ApiResponse<{
    list: Post[];
    total: number;
  }>
> => {
  if (USE_MOCK) {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    const allPosts = MOCK_USER_POSTS[userId] || [];
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const posts = allPosts.slice(startIndex, endIndex);

    return Promise.resolve({
      code: 0,
      message: "success",
      data: {
        list: posts,
        total: allPosts.length,
      },
    });
  }

  return apiClient.get(
    `/users/${userId}/posts?page=${page}&pageSize=${pageSize}`
  );
};
