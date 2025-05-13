/**
 * 发布内容模型
 * 处理与发布内容相关的数据库操作
 */
const pool = require('../config/db');

const releaseModel = {
    /**
     * 初始化发布内容表
     * 创建存储发布信息的数据表
     * 
     * 表结构：
     * - releaseID: 发布内容ID（字符串）
     * - userID: 用户ID（字符串）
     * - title: 标题（字符串）
     * - playTime: 游玩时间（数字）
     * - money: 费用（数字）
     * - personNum: 人数（数字）
     * - content: 内容描述（字符串）
     * - pictures: 图片URL数组（TEXT格式存储JSON字符串）
     * - videos: 视频URL数组（TEXT格式存储JSON字符串）
     * - cover: 视频封面URL（字符串）
     * - location: 位置（字符串）
     * - state: 审核状态（字符串）'wait'、'resolve'、'reject'
     * - reason: 未通过原因（字符串）
     * - delete: 逻辑删除标志（数字）1表示未删除，0表示已删除
     */
    initTable: async () => {
        try {
            await pool.query(`
        CREATE TABLE IF NOT EXISTS releases (
          id INT AUTO_INCREMENT PRIMARY KEY,
          releaseID VARCHAR(50) UNIQUE NOT NULL,
          userID VARCHAR(50) NOT NULL,
          title VARCHAR(100) NOT NULL,
          playTime INT DEFAULT 0,
          money DECIMAL(10, 2) DEFAULT 0,
          personNum INT DEFAULT 1,
          content TEXT,
          pictures TEXT,
          videos TEXT,
          cover VARCHAR(255),
          location VARCHAR(255),
          state VARCHAR(20) DEFAULT 'wait',
          reason VARCHAR(255) DEFAULT '待审核',
          \`delete\` TINYINT DEFAULT 1,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
        )
      `);
            console.log('发布内容表初始化成功');

            // 检查是否需要插入测试数据
            const [rows] = await pool.query('SELECT COUNT(*) as count FROM releases');
            if (rows[0].count === 0) {
                // 插入测试数据
                await releaseModel.insertTestData();
            }
        } catch (error) {
            console.error('初始化发布内容表失败:', error);
            throw error;
        }
    },

    /**
     * 插入测试数据
     */
    // cover可选值:
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062812379-djpacmlc.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062912193-gmwt6b8l.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062977958-zkywy70r.jpg    
    // pictures可选值:
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811531-z1tk879y.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811718-qlnms9wp.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811823-pmxmo299.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811941-4s1hb6ok.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062812071-xo2zmpa9.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911376-9r0e286p.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911500-0xfzbale.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911596-g8zo4vit.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911705-sdqzgucp.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911818-dyxgbcx3.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977221-mvp0p2ri.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977376-a65jxuvu.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977461-rh0qwue6.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977553-47mq5tlt.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977653-anv70wwt.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023406-ib5myy7r.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023494-zib88x1k.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023578-5xfynugy.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023660-7ic1xmjr.jpg
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023804-duvkpyij.jpg
    // videos可选值:
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062812242-r2s0gzlg.mp4
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062912039-ovbtchzk.mp4
    // https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062977831-6pjxzbst.mp4
    insertTestData: async () => {
        try {
            // 插入测试发布内容
            await pool.query(`
        INSERT INTO releases (releaseID, userID, title, playTime, money, personNum, content, pictures, videos, cover, location, state, reason, \`delete\`) VALUES
        ('release1', 'user1', '姑苏游记', 180, 600, 2, '苏州园林美如画，小桥流水人家，古典韵味十足。拙政园的布局精巧，狮子林的假山迷人。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811531-z1tk879y.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811718-qlnms9wp.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811823-pmxmo299.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062812242-r2s0gzlg.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062812379-djpacmlc.jpg', '苏州市姑苏区', 'resolve', '', 1),
        ('release2', 'user1', '拙政园行', 120, 450, 3, '拙政园是苏州园林的代表，亭台楼阁错落有致，水景与植物相得益彰，漫步其中如入画境。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811941-4s1hb6ok.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062812071-xo2zmpa9.jpg"]', '[]', NULL, '苏州市姑苏区拙政园', 'resolve', '', 1),
        ('release3', 'user1', '苏州一日游', 90, 300, 1, '清晨漫步平江路，古老的青石板路诉说着千年历史。午后在狮子林中穿梭，仿佛置身迷宫。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911376-9r0e286p.jpg"]', '[]', NULL, '苏州市平江区', 'resolve', '', 1),
        ('release4', 'user1', '虎丘之行', 150, 550, 2, '虎丘山上古塔倾斜，有东方比萨斜塔之称。山下千年古剑池静谧深邃，传说是吴王阖闾的埋剑之处。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911500-0xfzbale.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911596-g8zo4vit.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911705-sdqzgucp.jpg"]', '[]', NULL, '苏州市虎丘区', 'resolve', '', 1),
        ('release5', 'user1', '枫桥夜泊', 200, 700, 4, '夜晚的枫桥寂静幽远，寒山寺的钟声悠扬传来，如同张继诗中所描述的那般意境深远。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911818-dyxgbcx3.jpg"]', '[]', NULL, '苏州市姑苏区寒山寺', 'resolve', '', 1),
        ('release6', 'user1', '留园小记', 160, 480, 2, '留园布局精巧，中西合璧。假山叠石技艺高超，亭台楼榭相映成趣，是苏州园林艺术的瑰宝。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977221-mvp0p2ri.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977376-a65jxuvu.jpg"]', '[]', NULL, '苏州市姑苏区留园', 'resolve', '', 1),
        ('release7', 'user1', '金鸡湖畔', 130, 400, 3, '现代化的金鸡湖与古老的苏州形成鲜明对比，湖畔的摩天大楼倒映在水中，夜景尤为壮观。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977461-rh0qwue6.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977553-47mq5tlt.jpg"]', '[]', NULL, '苏州市工业园区金鸡湖', 'resolve', '', 1),
        ('release8', 'user1', '山塘街漫步', 110, 350, 2, '山塘街是苏州最古老的街区之一，被誉为"吴中第一名胜"，街道两旁的明清建筑保存完好。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977653-anv70wwt.jpg"]', '[]', NULL, '苏州市姑苏区山塘街', 'resolve', '', 1),
        ('release9', 'user1', '苏州博物馆', 140, 280, 1, '贝聿铭设计的苏州博物馆将现代建筑与传统园林元素完美融合，馆内藏品丰富，展现吴文化精髓。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023406-ib5myy7r.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023494-zib88x1k.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062912039-ovbtchzk.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062912193-gmwt6b8l.jpg', '苏州市姑苏区东北街', 'resolve', '', 1),
        ('release10', 'user1', '沧浪亭游', 170, 320, 2, '沧浪亭是苏州最古老的园林，以水石取胜，园内"沧浪濯缨"石刻见证了千年历史。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023578-5xfynugy.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023660-7ic1xmjr.jpg"]', '[]', NULL, '苏州市沧浪区沧浪亭', 'resolve', '', 1),
        ('release11', 'user1', '苏州评弹', 95, 260, 2, '在评弹博物馆聆听苏州评弹，那抑扬顿挫的曲调仿佛穿越时空，带人回到旧时苏州。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023804-duvkpyij.jpg"]', '[]', NULL, '苏州市平江区评弹博物馆', 'resolve', '', 1),
        ('release12', 'user1', '同里水乡行', 200, 650, 3, '同里古镇水网交织，明清建筑鳞次栉比，乘小船穿行于狭窄水道，感受江南水乡静谧之美。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811531-z1tk879y.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811718-qlnms9wp.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062977831-6pjxzbst.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062977958-zkywy70r.jpg', '苏州市吴江区同里古镇', 'resolve', '', 1),
        ('release13', 'user2', '苏州园林之美', 180, 580, 2, '苏州园林是中国传统园林的典范，拙政园、留园布局各异，却都体现了中国园林"虽由人作，宛自天开"的境界。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811823-pmxmo299.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811941-4s1hb6ok.jpg"]', '[]', NULL, '苏州市姑苏区', 'resolve', '', 1),
        ('release14', 'user2', '平江之旅', 120, 400, 2, '平江路的小桥流水人家，体现了苏州"小桥流水"的特色。古宅、茶馆、小店各具韵味。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062812071-xo2zmpa9.jpg"]', '[]', NULL, '苏州市姑苏区平江路', 'resolve', '', 1),
        ('release15', 'user2', '观前街游记', 150, 500, 3, '观前街是苏州最热闹的商业街，古老建筑与现代商铺共存，各种苏州小吃让人垂涎。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911376-9r0e286p.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911500-0xfzbale.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911596-g8zo4vit.jpg"]', '[]', NULL, '苏州市姑苏区观前街', 'resolve', '', 1),
        ('release16', 'user2', '狮子林探秘', 130, 420, 2, '狮子林以假山著称，石峰林立，曲径通幽，仿佛置身迷宫，是苏州园林中最具游戏性的一座。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911705-sdqzgucp.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911818-dyxgbcx3.jpg"]', '[]', NULL, '苏州市姑苏区狮子林', 'resolve', '', 1),
        ('release17', 'user2', '周庄古镇', 190, 700, 4, '周庄被誉为"中国第一水乡"，双桥、沈厅、张厅等古迹保存完好，乘船游览水乡风光令人陶醉。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977221-mvp0p2ri.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062812242-r2s0gzlg.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062812379-djpacmlc.jpg', '苏州市昆山市周庄镇', 'resolve', '', 1),
        ('release18', 'user2', '木渎古镇行', 160, 520, 3, '木渎古镇有"吴中第一镇"之称，镇内园林众多，山水相映，是文人墨客的理想栖居地。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977376-a65jxuvu.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977461-rh0qwue6.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977553-47mq5tlt.jpg"]', '[]', NULL, '苏州市吴中区木渎镇', 'resolve', '', 1),
        ('release19', 'user2', '网师园小记', 110, 340, 1, '网师园虽小巧却精致无比，"咫尺山林"的造园理念在此体现得淋漓尽致，是苏州园林中的精品。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977653-anv70wwt.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023406-ib5myy7r.jpg"]', '[]', NULL, '苏州市姑苏区带城桥路', 'resolve', '', 1),
        ('release20', 'user2', '苏州丝绸', 90, 280, 2, '参观苏州丝绸博物馆，了解苏州丝绸发展史，欣赏精美丝绸制品，感受吴地的丝绸文化。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023494-zib88x1k.jpg"]', '[]', NULL, '苏州市姑苏区丝绸博物馆', 'resolve', '', 1)
      `);

            // 插入中间部分的测试发布内容
            await pool.query(`
        INSERT INTO releases (releaseID, userID, title, playTime, money, personNum, content, pictures, videos, cover, location, state, reason, \`delete\`) VALUES
        ('release21', 'user2', '苏州老街探访', 140, 380, 2, '平江路、山塘街、七里山塘，古老的街巷承载着苏州的历史记忆，漫步其中，仿佛穿越时空回到旧时光。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023578-5xfynugy.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023660-7ic1xmjr.jpg"]', '[]', NULL, '苏州市姑苏区平江路', 'resolve', '', 1),
        ('release22', 'user2', '太湖游船', 160, 480, 3, '乘船游览太湖，碧波荡漾，湖光山色尽收眼底，尤其是夕阳西下时分，景色更是迷人。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023804-duvkpyij.jpg"]', '[]', NULL, '苏州市吴中区太湖', 'resolve', '', 1),
        ('release23', 'user2', '苏州美食之旅', 120, 350, 2, '松鼠桂鱼、叫花鸡、碧螺春茶，苏州美食既有江南水乡的精致，又兼具本土特色的风味。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811531-z1tk879y.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811718-qlnms9wp.jpg"]', '[]', NULL, '苏州市姑苏区观前街', 'resolve', '', 1),
        ('release24', 'user2', '苏州传统园艺', 150, 320, 1, '苏州园林中的盆景、花卉与假山石组合艺术，体现了江南人对自然的理解与追求。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811823-pmxmo299.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062812242-r2s0gzlg.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062812379-djpacmlc.jpg', '苏州市姑苏区拙政园', 'resolve', '', 1),
        ('release25', 'user3', '慕容故居', 130, 360, 2, '据传为晋代慕容氏后裔的宅院，古色古香，庭院深深，体现了苏州民居的精巧与雅致。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811941-4s1hb6ok.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062812071-xo2zmpa9.jpg"]', '[]', NULL, '苏州市姑苏区平江路', 'resolve', '', 1),
        ('release26', 'user3', '天平山赏枫', 170, 450, 3, '秋季的天平山红枫似火，满山层林尽染，是苏州赏枫的绝佳去处。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911376-9r0e286p.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911500-0xfzbale.jpg"]', '[]', NULL, '苏州市吴中区天平山', 'resolve', '', 1),
        ('release27', 'user3', '苏州刺绣博物馆', 110, 280, 1, '苏州刺绣是中国四大名绣之首，刺绣博物馆展示了历代精美的刺绣作品，技艺精湛令人叹为观止。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911596-g8zo4vit.jpg"]', '[]', NULL, '苏州市姑苏区刺绣博物馆', 'resolve', '', 1),
        ('release28', 'user3', '甪直古镇', 180, 520, 3, '甪直古镇有"吴中第一镇"之称，保留着原汁原味的水乡风貌，小桥流水，古宅临河。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911705-sdqzgucp.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911818-dyxgbcx3.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062912039-ovbtchzk.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062912193-gmwt6b8l.jpg', '苏州市昆山市甪直镇', 'resolve', '', 1),
        ('release29', 'user3', '苏州桃花源', 120, 300, 2, '苏州太湖之滨的桃花源景区，春季桃花盛开，粉红一片，宛如陶渊明笔下的世外桃源。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977221-mvp0p2ri.jpg"]', '[]', NULL, '苏州市吴中区光福镇', 'resolve', '', 1),
        ('release30', 'user3', '吴中博物馆', 90, 240, 1, '吴中博物馆收藏了丰富的吴文化遗产，从新石器时代良渚文化到近现代的吴地风物，展示了苏州深厚的历史底蕴。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977376-a65jxuvu.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977461-rh0qwue6.jpg"]', '[]', NULL, '苏州市吴中区博物馆', 'resolve', '', 1),
        ('release31', 'user3', '苏州乐园', 200, 580, 4, '苏州乐园是江苏省规模最大的主题乐园，园内游乐设施丰富，适合亲子游玩，尽情享受欢乐时光。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977553-47mq5tlt.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062977831-6pjxzbst.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062977958-zkywy70r.jpg', '苏州市虎丘区苏州乐园', 'resolve', '', 1),
        ('release32', 'user3', '苏州书法博物馆', 130, 280, 2, '馆内收藏了历代书法名家的墨宝，从汉代简牍到当代书法，展示了中国书法艺术的博大精深。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977653-anv70wwt.jpg"]', '[]', NULL, '苏州市姑苏区书法博物馆', 'resolve', '', 1),
        ('release33', 'user3', '苏州丝绸博物馆', 140, 320, 2, '苏州是中国丝绸之府，博物馆展示了从蚕桑养殖到丝绸织造的全过程，以及精美的丝绸制品。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023406-ib5myy7r.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023494-zib88x1k.jpg"]', '[]', NULL, '苏州市姑苏区丝绸博物馆', 'resolve', '', 1),
        ('release34', 'user3', '上方山森林公园', 160, 360, 3, '上方山森林公园植被茂密，空气清新，山顶可俯瞰苏州城区全景，是登高望远的好去处。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023578-5xfynugy.jpg"]', '[]', NULL, '苏州市吴中区上方山', 'resolve', '', 1),
        ('release35', 'user3', '耦园', 120, 300, 2, '耦园是苏州园林的代表作之一，以精巧的建筑布局和典雅的园林风格著称，被誉为"小中见大"的典范。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023660-7ic1xmjr.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023804-duvkpyij.jpg"]', '[]', NULL, '苏州市姑苏区耦园', 'resolve', '', 1),
        ('release36', 'user3', '苏州民俗博物馆', 110, 280, 2, '博物馆生动展示了苏州地区的民间习俗、传统节日和生活方式，是了解苏州民俗文化的窗口。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811531-z1tk879y.jpg"]', '[]', NULL, '苏州市姑苏区民俗博物馆', 'resolve', '', 1),
        ('release37', 'user4', '沧浪亭园', 130, 320, 2, '沧浪亭是苏州最古老的园林，以水石取胜，园内"沧浪濯缨"石刻体现了古人的高洁品格。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811718-qlnms9wp.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811823-pmxmo299.jpg"]', '[]', NULL, '苏州市姑苏区沧浪亭', 'resolve', '', 1),
        ('release38', 'user4', '苏州科技馆', 150, 280, 3, '苏州科技馆通过互动展项和科普展示，让游客了解前沿科技，是寓教于乐的好去处。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811941-4s1hb6ok.jpg"]', '[]', NULL, '苏州市高新区科技馆', 'resolve', '', 1),
        ('release39', 'user4', '常熟兴福寺', 140, 320, 2, '兴福寺历史悠久，寺内古木参天，殿宇肃穆，钟声悠扬，是体验佛教文化的清净之地。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062812071-xo2zmpa9.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911376-9r0e286p.jpg"]', '[]', NULL, '苏州市常熟市兴福寺', 'resolve', '', 1),
        ('release40', 'user4', '昆山锦溪古镇', 180, 520, 3, '锦溪古镇水网密布，有"江南水乡第一镇"之称，古桥、老街、水巷勾勒出一幅江南水墨画。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911500-0xfzbale.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911596-g8zo4vit.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911705-sdqzgucp.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062812242-r2s0gzlg.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062812379-djpacmlc.jpg', '苏州市昆山市锦溪镇', 'resolve', '', 1)
      `);

            // 插入剩余的测试发布内容
            await pool.query(`
        INSERT INTO releases (releaseID, userID, title, playTime, money, personNum, content, pictures, videos, cover, location, state, reason, \`delete\`) VALUES
        ('release41', 'user4', '七里山塘', 120, 380, 2, '山塘街被誉为"姑苏第一名街"，全长七里，沿河而建，古建筑鳞次栉比，是体验苏州传统商业文化的好去处。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023406-ib5myy7r.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023494-zib88x1k.jpg"]', '[]', NULL, '苏州市姑苏区山塘街', 'resolve', '', 1),
        ('release42', 'user4', '苏州观前', 100, 320, 1, '观前街是苏州最繁华的商业街，各类传统老店与现代品牌共存，充分展现了古今交融的苏州城市风貌。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023578-5xfynugy.jpg"]', '[]', NULL, '苏州市姑苏区观前街', 'resolve', '', 1),
        ('release43', 'user4', '藕园小憩', 140, 430, 2, '藕园虽小却精致典雅，以荷花著称，处处透露出江南园林的精巧设计，格调高雅。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023660-7ic1xmjr.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023804-duvkpyij.jpg"]', '[]', NULL, '苏州市吴中区藕园', 'resolve', '', 1),
        ('release44', 'user4', '古运河夜景', 170, 500, 3, '夜晚的古运河两岸灯火辉煌，游船穿梭其间，倒影在水中摇曳，营造出梦幻般的水乡夜色。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811531-z1tk879y.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811718-qlnms9wp.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062977831-6pjxzbst.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062977958-zkywy70r.jpg', '苏州市姑苏区古运河', 'resolve', '', 1),
        ('release45', 'user4', '石湖游船', 150, 450, 2, '石湖风景如画，乘船游览，可欣赏湖光山色，尤其是湖心岛的景色更是迷人。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811823-pmxmo299.jpg"]', '[]', NULL, '苏州市吴中区石湖', 'resolve', '', 1),
        ('release46', 'user4', '苏州评弹', 130, 380, 2, '苏州评弹是江南文化的瑰宝，那轻快的弹拨声和绵长的唱腔令人陶醉，充分展现了江南文化的精髓。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811941-4s1hb6ok.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062812071-xo2zmpa9.jpg"]', '[]', NULL, '苏州市姑苏区评弹艺术中心', 'resolve', '', 1),
        ('release47', 'user4', '苏绣精品', 100, 300, 1, '苏绣是中国四大名绣之一，参观苏绣研究所，欣赏匠人们精湛的绣艺，领略传统工艺的魅力。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911376-9r0e286p.jpg"]', '[]', NULL, '苏州市姑苏区苏绣研究所', 'resolve', '', 1),
        ('release48', 'user4', '常熟沙家浜', 190, 580, 4, '沙家浜风景区集革命历史和自然风光于一体，芦苇荡、水乡村舍构成了一幅美丽的江南画卷。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911500-0xfzbale.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911596-g8zo4vit.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911705-sdqzgucp.jpg"]', '[]', NULL, '苏州市常熟市沙家浜', 'resolve', '', 1),
        ('release49', 'user5', '苏州园林美学', 160, 520, 2, '苏州园林集中国传统哲学、美学于一体，移步异景的设计理念令游客在有限空间中感受无限美景。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911818-dyxgbcx3.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977221-mvp0p2ri.jpg"]', '[]', NULL, '苏州市姑苏区', 'resolve', '', 1),
        ('release50', 'user5', '苏州丝竹', 120, 400, 2, '聆听苏州丝竹，那轻柔婉转的曲调如行云流水，是苏州传统文化的重要组成部分。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977376-a65jxuvu.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062812242-r2s0gzlg.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062812379-djpacmlc.jpg', '苏州市姑苏区苏州丝竹表演厅', 'resolve', '', 1),
        ('release51', 'user5', '阳澄湖之旅', 140, 650, 3, '阳澄湖是中国著名的大闸蟹产地，湖光潋滟，品尝鲜美大闸蟹，享受舌尖上的苏州。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977461-rh0qwue6.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977553-47mq5tlt.jpg"]', '[]', NULL, '苏州市昆山市阳澄湖', 'resolve', '', 1),
        ('release52', 'user5', '浮生六记居', 110, 350, 2, '参观浮生六记纪念馆，沉浸在沈复笔下的那个充满诗情画意的苏州世界。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977653-anv70wwt.jpg"]', '[]', NULL, '苏州市姑苏区阊门', 'resolve', '', 1),
        ('release53', 'user5', '光福古镇', 170, 520, 3, '光福古镇依山而建，环境清幽，是避暑休闲的好去处，镇内的报国寺历史悠久，值得一游。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023406-ib5myy7r.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023494-zib88x1k.jpg"]', '[]', NULL, '苏州市吴中区光福镇', 'resolve', '', 1),
        ('release54', 'user5', '苏州工艺园', 130, 380, 2, '苏州工艺美术博物馆收藏了大量苏州传统工艺品，展示了苏州精湛的手工艺传统。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023578-5xfynugy.jpg"]', '[]', NULL, '苏州市姑苏区工艺美术博物馆', 'resolve', '', 1),
        ('release55', 'user5', '昆曲之美', 100, 320, 1, '昆曲是苏州的文化瑰宝，在昆曲博物馆了解这一"百戏之祖"的历史，欣赏其优雅的表演艺术。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023660-7ic1xmjr.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747063023804-duvkpyij.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062912039-ovbtchzk.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062912193-gmwt6b8l.jpg', '苏州市姑苏区昆曲博物馆', 'resolve', '', 1),
        ('release56', 'user5', '白洋湾古镇', 150, 480, 3, '白洋湾古镇位于太湖之畔，环境优美，水网密布，古建筑保存完好，是体验苏州水乡文化的佳地。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811531-z1tk879y.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811718-qlnms9wp.jpg"]', '[]', NULL, '苏州市吴中区白洋湾', 'resolve', '', 1),
        ('release57', 'user5', '盘门景区', 120, 350, 2, '盘门是苏州古城的水陆城门，"水陆盘门"是苏州古城的景观之一，展现了古代苏州的防御系统。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811823-pmxmo299.jpg"]', '[]', NULL, '苏州市姑苏区盘门景区', 'resolve', '', 1),
        ('release58', 'user5', '冯梦龙故居', 90, 280, 1, '参观冯梦龙故居，了解这位明代文学家的生平事迹，感受苏州深厚的文化底蕴。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062811941-4s1hb6ok.jpg"]', '[]', NULL, '苏州市吴江区冯梦龙故居', 'resolve', '', 1),
        ('release59', 'user5', '苏州园林博物馆', 130, 400, 2, '苏州园林博物馆全面展示了苏州园林的发展历史和艺术特色，是了解苏州园林文化的窗口。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062812071-xo2zmpa9.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911376-9r0e286p.jpg"]', '[]', NULL, '苏州市姑苏区园林博物馆', 'resolve', '', 1),
        ('release60', 'user5', '太湖明珠', 180, 550, 4, '太湖明珠是苏州太湖国家旅游度假区的标志性建筑，登上明珠塔可俯瞰整个太湖美景。', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911500-0xfzbale.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911596-g8zo4vit.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911705-sdqzgucp.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062911818-dyxgbcx3.jpg", "https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/image/1747062977221-mvp0p2ri.jpg"]', '["https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/video/1747062977831-6pjxzbst.mp4"]', 'https://objectstorageapi.bja.sealos.run/bpj63jw3-travel-app-uploads/cover/1747062977958-zkywy70r.jpg', '苏州市吴中区太湖国家旅游度假区', 'resolve', '', 1)
      `);

            console.log('测试发布内容数据已插入');
        } catch (error) {
            console.error('插入测试数据失败:', error);
            throw error;
        }
    },

    /**
     * 获取所有发布内容
     * @param {number} limit - 限制条数，默认为50
     * @param {number} offset - 偏移量，默认为0
     * @param {string} state - 审核状态，默认为'resolve'
     * @returns {Array} - 发布内容列表
     */
    getAllReleases: async (limit = 50, offset = 0, state = 'resolve') => {
        try {
            const [rows] = await pool.query(
                `SELECT r.*, u.userName, u.avatar 
                FROM releases r
                LEFT JOIN users u ON r.userID = u.userID
                WHERE r.state = ? AND r.\`delete\` = 1
                ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`,
                [state, limit, offset]
            );

            // 处理返回的数据，确保图片和视频是JSON对象
            return rows.map(row => ({
                ...row,
                pictures: JSON.parse(row.pictures || '[]'),
                videos: JSON.parse(row.videos || '[]')
            }));
        } catch (error) {
            console.error('获取发布内容列表失败:', error);
            throw error;
        }
    },

    /**
     * 根据发布内容ID获取发布内容
     * @param {string} releaseID - 发布内容ID
     * @returns {Object|null} - 发布内容对象或null
     */
    getReleaseByID: async (releaseID) => {
        try {
            const [rows] = await pool.query(
                `SELECT r.*, u.userName, u.avatar 
                FROM releases r
                LEFT JOIN users u ON r.userID = u.userID
                WHERE r.releaseID = ? AND r.\`delete\` = 1`,
                [releaseID]
            );

            if (!rows.length) return null;

            // 处理返回的数据，确保图片和视频是JSON对象
            const release = rows[0];
            return {
                ...release,
                pictures: JSON.parse(release.pictures || '[]'),
                videos: JSON.parse(release.videos || '[]')
            };
        } catch (error) {
            console.error('获取发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 根据用户ID获取该用户的所有发布内容
     * @param {string} userID - 用户ID
     * @returns {Array} - 发布内容列表
     */
    getReleasesByUserID: async (userID) => {
        try {
            const [rows] = await pool.query(
                `SELECT r.*, u.userName, u.avatar 
                FROM releases r
                LEFT JOIN users u ON r.userID = u.userID
                WHERE r.userID = ? AND r.\`delete\` = 1
                ORDER BY r.createdAt DESC`,
                [userID]
            );

            // 处理返回的数据，确保图片和视频是JSON对象
            return rows.map(row => ({
                ...row,
                pictures: JSON.parse(row.pictures || '[]'),
                videos: JSON.parse(row.videos || '[]')
            }));
        } catch (error) {
            console.error('获取用户发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 创建新的发布内容
     * @param {Object} releaseData - 发布内容数据
     * @returns {Object} - 创建的发布内容
     */
    createRelease: async (releaseData) => {
        try {
            const {
                releaseID,
                userID,
                title,
                playTime,
                money,
                personNum,
                content,
                pictures,
                videos,
                cover,
                location
            } = releaseData;

            // 检查releaseID是否已存在
            const existingRelease = await releaseModel.getReleaseByID(releaseID);
            if (existingRelease) {
                throw new Error('发布内容ID已存在');
            }

            // 处理图片和视频数组
            const picturesJSON = pictures ? JSON.stringify(pictures) : '[]';
            const videosJSON = videos ? JSON.stringify(videos) : '[]';

            // 插入新发布内容，默认审核状态为wait，原因为待审核，默认未删除
            await pool.query(
                `INSERT INTO releases 
         (releaseID, userID, title, playTime, money, personNum, content, pictures, videos, cover, location, state, reason, \`delete\`) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'wait', '待审核', 1)`,
                [releaseID, userID, title, playTime, money, personNum, content, picturesJSON, videosJSON, cover || null, location]
            );

            // 返回创建的发布内容
            return await releaseModel.getReleaseByID(releaseID);
        } catch (error) {
            console.error('创建发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 更新发布内容
     * @param {string} releaseID - 发布内容ID
     * @param {Object} updateData - 要更新的数据
     * @returns {Object} - 更新后的发布内容
     */
    updateRelease: async (releaseID, updateData) => {
        try {
            const allowedFields = ['title', 'playTime', 'money', 'personNum', 'content', 'pictures', 'videos', 'cover', 'location', 'state', 'reason'];
            const updates = [];
            const values = [];

            // 构建更新字段
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    updates.push(`${field} = ?`);

                    // 处理JSON字段
                    if (field === 'pictures' || field === 'videos') {
                        values.push(JSON.stringify(updateData[field]));
                    } else {
                        values.push(updateData[field]);
                    }
                }
            }

            if (updates.length === 0) {
                throw new Error('没有提供有效的更新字段');
            }

            // 添加releaseID作为条件
            values.push(releaseID);

            // 执行更新
            await pool.query(
                `UPDATE releases SET ${updates.join(', ')} WHERE releaseID = ?`,
                values
            );

            // 返回更新后的发布内容
            return await releaseModel.getReleaseByID(releaseID);
        } catch (error) {
            console.error('更新发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 更新游记审核状态
     * @param {string} releaseID - 发布内容ID
     * @param {string} state - 审核状态 'wait', 'resolve', 'reject'
     * @param {string} reason - 未通过原因（当状态为reject时必须提供）
     * @returns {Object} - 更新后的发布内容
     */
    updateReleaseState: async (releaseID, state, reason) => {
        try {
            // 验证状态值
            if (!['wait', 'resolve', 'reject'].includes(state)) {
                throw new Error('无效的审核状态值');
            }

            // 如果状态为reject，必须提供原因
            if (state === 'reject' && (!reason || reason.trim() === '')) {
                throw new Error('拒绝时必须提供原因');
            }

            // 设置默认原因
            let updatedReason = reason;
            if (state === 'wait') {
                updatedReason = '待审核';
            } else if (state === 'resolve' && (!reason || reason.trim() === '')) {
                updatedReason = '';
            }

            // 执行更新
            await pool.query(
                `UPDATE releases SET state = ?, reason = ? WHERE releaseID = ?`,
                [state, updatedReason, releaseID]
            );

            // 返回更新后的发布内容
            return await releaseModel.getReleaseByID(releaseID);
        } catch (error) {
            console.error('更新游记审核状态失败:', error);
            throw error;
        }
    },

    /**
     * 删除发布内容
     * @param {string} releaseID - 发布内容ID
     * @returns {boolean} - 操作是否成功
     */
    deleteRelease: async (releaseID) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM releases WHERE releaseID = ?',
                [releaseID]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('删除发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 根据releaseID列表批量获取发布内容
     * @param {Array} releaseIDs - 发布内容ID数组
     * @returns {Array} - 发布内容列表
     */
    getReleasesByIDs: async (releaseIDs) => {
        try {
            if (!releaseIDs || releaseIDs.length === 0) {
                return [];
            }

            // 使用 IN 操作符查询多个ID
            const placeholders = releaseIDs.map(() => '?').join(',');
            const [rows] = await pool.query(
                `SELECT r.*, u.userName, u.avatar 
                FROM releases r
                LEFT JOIN users u ON r.userID = u.userID
                WHERE r.releaseID IN (${placeholders}) AND r.\`delete\` = 1
                ORDER BY r.createdAt DESC`,
                releaseIDs
            );

            // 处理返回的数据，确保图片和视频是JSON对象
            return rows.map(row => ({
                ...row,
                pictures: JSON.parse(row.pictures || '[]'),
                videos: JSON.parse(row.videos || '[]')
            }));
        } catch (error) {
            console.error('批量获取发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 根据标题搜索发布内容
     * @param {string} title - 要搜索的标题关键词
     * @param {string} state - 审核状态，默认为'resolve'
     * @returns {Array} - 匹配的发布内容列表
     */
    searchReleasesByTitle: async (title, state = 'resolve') => {
        try {
            console.log(`[DEBUG] 开始搜索标题含有 "${title}" 的发布内容，状态为 ${state}`);

            const [rows] = await pool.query(
                `SELECT r.*, u.userName, u.avatar 
                FROM releases r
                LEFT JOIN users u ON r.userID = u.userID
                WHERE r.title LIKE ? AND r.state = ? AND r.\`delete\` = 1
                ORDER BY r.createdAt DESC`,
                [`%${title}%`, state]
            );

            console.log(`[DEBUG] 标题搜索结果数量: ${rows.length}`);
            if (rows.length > 0) {
                console.log(`[DEBUG] 搜索到的标题:`);
                rows.forEach((row, index) => {
                    console.log(`[DEBUG] ${index + 1}. "${row.title}" (ID: ${row.releaseID})`);
                });
            }

            // 处理返回的数据，确保图片和视频是JSON对象
            return rows.map(row => ({
                ...row,
                pictures: JSON.parse(row.pictures || '[]'),
                videos: JSON.parse(row.videos || '[]')
            }));
        } catch (error) {
            console.error('根据标题搜索发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 根据用户名搜索发布内容
     * @param {string} userName - 用户名
     * @param {string} state - 审核状态，默认为'resolve'
     * @returns {Array} - 匹配的发布内容列表
     */
    searchReleasesByUserName: async (userName, state = 'resolve') => {
        try {
            const [rows] = await pool.query(
                `SELECT r.*, u.userName, u.avatar 
                FROM releases r
                LEFT JOIN users u ON r.userID = u.userID
                WHERE u.userName = ? AND r.state = ? AND r.\`delete\` = 1
                ORDER BY r.createdAt DESC`,
                [userName, state]
            );

            // 处理返回的数据，确保图片和视频是JSON对象
            return rows.map(row => ({
                ...row,
                pictures: JSON.parse(row.pictures || '[]'),
                videos: JSON.parse(row.videos || '[]')
            }));
        } catch (error) {
            console.error('根据用户名搜索发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 同时根据用户ID和标题搜索发布内容
     * @param {string} userID - 用户ID
     * @param {string} title - 标题关键词
     * @returns {Array} - 匹配的发布内容列表
     */
    searchReleasesByUserIDAndTitle: async (userID, title) => {
        try {
            const [rows] = await pool.query(
                `SELECT r.*, u.userName, u.avatar 
                FROM releases r
                LEFT JOIN users u ON r.userID = u.userID
                WHERE r.userID = ? AND r.title LIKE ? AND r.\`delete\` = 1
                ORDER BY r.createdAt DESC`,
                [userID, `%${title}%`]
            );

            // 处理返回的数据，确保图片和视频是JSON对象
            return rows.map(row => ({
                ...row,
                pictures: JSON.parse(row.pictures || '[]'),
                videos: JSON.parse(row.videos || '[]')
            }));
        } catch (error) {
            console.error('同时根据用户ID和标题搜索发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 根据用户ID列表批量获取用户的发布内容
     * @param {Array} userIDs - 用户ID数组
     * @param {string} state - 审核状态，默认为'resolve'
     * @returns {Array} - 发布内容列表
     */
    getReleasesByUserIDs: async (userIDs, state = 'resolve') => {
        try {
            if (!userIDs || userIDs.length === 0) {
                return [];
            }

            // 使用 IN 操作符查询多个用户ID
            const placeholders = userIDs.map(() => '?').join(',');
            const parameters = [...userIDs, state];

            const [rows] = await pool.query(
                `SELECT r.*, u.userName, u.avatar 
                FROM releases r
                LEFT JOIN users u ON r.userID = u.userID
                WHERE r.userID IN (${placeholders}) AND r.state = ? AND r.\`delete\` = 1
                ORDER BY r.createdAt DESC`,
                parameters
            );

            // 处理返回的数据，确保图片和视频是JSON对象
            return rows.map(row => ({
                ...row,
                pictures: JSON.parse(row.pictures || '[]'),
                videos: JSON.parse(row.videos || '[]')
            }));
        } catch (error) {
            console.error('批量获取用户发布内容失败:', error);
            throw error;
        }
    },

    /**
     * 更新游记的逻辑删除状态
     * @param {string} releaseID - 发布内容ID
     * @param {number} deleteStatus - 删除状态：0表示已删除，1表示未删除
     * @returns {boolean} - 操作是否成功
     */
    updateReleaseDeleteStatus: async (releaseID, deleteStatus) => {
        try {
            // 验证删除状态值
            if (![0, 1].includes(deleteStatus)) {
                throw new Error('无效的删除状态值，只能是0或1');
            }

            // 执行更新
            const [result] = await pool.query(
                `UPDATE releases SET \`delete\` = ? WHERE releaseID = ?`,
                [deleteStatus, releaseID]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('更新游记逻辑删除状态失败:', error);
            throw error;
        }
    },

    /**
     * 获取已逻辑删除的发布内容
     * @param {number} limit - 限制条数，默认为50
     * @param {number} offset - 偏移量，默认为0
     * @returns {Array} - 已删除的发布内容列表
     */
    getDeletedReleases: async (limit = 50, offset = 0) => {
        try {
            const [rows] = await pool.query(
                `SELECT r.*, u.userName, u.avatar 
                FROM releases r
                LEFT JOIN users u ON r.userID = u.userID
                WHERE r.\`delete\` = 0
                ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`,
                [limit, offset]
            );

            // 处理返回的数据，确保图片和视频是JSON对象
            return rows.map(row => ({
                ...row,
                pictures: JSON.parse(row.pictures || '[]'),
                videos: JSON.parse(row.videos || '[]')
            }));
        } catch (error) {
            console.error('获取已删除发布内容列表失败:', error);
            throw error;
        }
    }
};

module.exports = releaseModel; 