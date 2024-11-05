## Dayjs

**快速且体积只有 2kB 的 Moment.js 替代者，具有同样现代的 API**

```tsx
import dayjs from "dayjs";

// zh-cn偏好, nodejs这样配置
import "dayjs/locale/zh-cn";  
dayjs.locale("zh-cn");

// 格式化时间字符串
dayjs.format()  // result: 2024-10-18T11:39:02+08:00

// 时间差，返回间隔分钟
dayjs().diff("2024-10-18T11:39:02+08:00", "minute");

// 时间追加，最后获取格式化的日期
// result: 2024-10-19T00:34:29+08:00
dayjs("2024-10-18T17:34:29+08:00").add(7, "hour").format()  
```