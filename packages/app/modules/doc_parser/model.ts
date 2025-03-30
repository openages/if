import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { getJson, hono } from '@/utils'

@injectable()
export default class Index {
	loading = false
	mds = [
		{
			content: "# 谢闻道-前端开发工程师.pdf\n## Metadata\n- PDFFormatVersion=1.7\n- Language=en\n- IsLinearized=false\n- IsAcroFormPresent=false\n- IsXFAPresent=false\n- IsCollectionPresent=false\n- IsSignaturesPresent=false\n- Creator=BOSS直聘\n- Producer=直聘简历\n- CreationDate=D:20250327045711+00'00'\n- ModDate=D:20250327045711Z\n- Title=直聘简历\n\n## Contents\n### Page 1\n北京云道天成科技有限公司   技术合伙人   2021.09-2023.11  谢闻道  男 | 年龄：28岁 |   18696486864   |   xiewendao@gmail.com  7年工作经验 | 求职意向：前端开发工程师 | 期望薪资：20-35K | 期望城市：武汉  个人优势  6k+star低代码开源项目 Yao App Engine开发者  独立开发产品 IF：AI Native生产力平台  我擅长的：  - 低代码平台的构建  - 富文本编辑器的开发和定制  - 开源项目的营销推广  - React性能极致优化  有丰富的低代码平台设计研发经验，前端/客户端架构师，设计工程师，参与设计和研发过超过10个企业级 toB 产品，开发过面向 百万用户的小程序。  有丰富的组件系统设计经验，精通 React 性能优化，有丰富的前端架构设计经验和小程序开发经验，以及桌面应用研发经验，擅 长技术栈：React、Electron、Trpc、Hono、Nextjs、Vue、Nodejs 、小程序、Taro。  目前创业在做为AI赋能的生产力平台IF（官网 https://if.openages.com 打开需科学上网）  https://github.com/1yasa  https://github.com/matrixage  https://github.com/YaoApp/yao  寻求一份具有挑战性（技术或商业）的，与 AI 生产力相关的，不是那么肝的工作（当然，如果既有挑战性又是我喜欢的事情，肝 也无妨）。  坚持实践才有意义，要刷题刷算法的勿扰，谢谢。现阶段致力于通过探索前端智能（多agent类脑调度）突破大模型的智能上限， 在智能性价比和性能之间寻求平衡，让每个人都能用 AI 发挥自身最大潜能。  备注：remote（远程） 或 base武汉  工作经历  内容:  （该工作为远程工作 base 杭州） 1.负责低代码应用引擎 Yao App Engine 的前端界面引擎 XGEN 的研发和设计： ● 架构设计 ● 组件设计 ● 插件化设计 2. 负责 Yao 网站的开发与维护：,### Page 2\n杭州米友圈科技有限公司   前端开发工程师   2021.02-2021.09  杭州蓝川科技有限公司   前端开发工程师   2020.03-2021.01  ● 设计和开发网站主战 ● 开发文档中心 3. 负责 Electron 应用 PMS (工程项目管理系统)的前端研发工作： ● 组件设计和开发 ● 低代码编辑器的开发  业绩:  1. 低代码应用引擎 Yao App Engine 的前端界面引擎 XGen： ● 从零到一打造了 star数6.5k的开源低代码项目 ● 提出并实践了 CAP 架构 ● 成功规划了前端界面引擎的坚实架构，确保系统的可扩展性和性能。 ● 设计并实现了多个高效的前端组件，提高了用户界面的交互性和用户体验。 ● 引入了插件化设计，增强了系统的可定制性，使客户能够轻松扩展应用功能。 ● 自研基于 MDX 的插件化文档系统，为用户提供高质量的文档和支持资源，增强了用户满意度。 2. Electron 应用 PMS 的前端研发工作： ● 设计并开发了高度定制化的前端组件，提供了丰富的用户界面功能。 ● 成功创建低代码编辑器，简化了工程项目管理，提高了工作效率。  内容:  负责米友圈小程序、电商后台的设计与开发。  业绩:  1. 米友圈小程序设计与开发： ● 成功设计出具有吸引力和用户友好性质的米友圈小程序界面，提升了用户体验。 ● 持续为小程序添加新功能，使其更具吸引力，提高用户参与度。 ● 确保米友圈小程序在不同平台和设备上正常运行，为更广泛的用户提供访问机会。 2. 电商后台： ● 设计和实施了强大的用户管理和权限系统，提供了对数据的安全访问和控制。 ● 通过合理的架构设计确保后台管理系统的可扩展性，以容纳未来的增长和新功能。  内容:  主要负责风火递小程序的开发与维护，以及相关代码的重构。  业绩:  1. 风火递小程序的开发与维护：  ● 成功设计和实施了风火递小程序，确保了高质量的代码，提供了出色的用户体验。  ● 负责小程序的持续稳定运行，及时解决问题，确保用户获得无故障的服务。  ● 积极回应用户反馈，根据用户需求不断改进小程序，提高了用户满意度。  ● 对小程序进行性能调优，提高了加载速度和响应时间，确保用户能够快速访问和使用。  2. 相关代码的重构：  ● 成功重构了小程序代码，提高了代码质量，使其更易维护和扩展。  ● 通过代码重构，改进了系统架构，提高了系统的可扩展性和可维护性。  ● 将新功能集成到现有代码中，为小程序增加了更多功能，提升了用户体验。  ● 开源小程序组件库 Light Design ，为公司小程序开发提供支持,### Page 3\n北京云道天成科技有限公司   前端开发工程师   2018.09-2019.09  XGen   设计师 & 项目负责人   2021.09-至今  风火递小程序   前端开发   2020.03-2021.01  小趣购小程序   前端开发   2019.10-2020.03  微品商城   设计师 & 前端开发   2019.03-2019.06  内容:  负责项目的前端设计和研发： 1. 微信小程序页面的设计和编写以及数据接口的对接 2. 基于 Vue的 Web 应用的设计和研发 3. 与客户进行沟通，完善产品并修复bug  业绩:  1. 上线了3款小程序应用，并获得客户的认可 2. 负责医管中心大数据问卷的项目，并成功交付 3. 微信小程序和 Vue 开发经验实现从零到熟练  项目经历  内容:  ● XGen是 Yao 低代码引擎的界面引擎实现。 ● 负责从零到一实现该基于 Yao 特性的低代码界面引擎，为B端客户提供技术支持  业绩:  ● 提出并实践了 CAP（Component As Prototype - 组件即原型） 架构 ● 三个月从零到一实现低代码界面引擎，三个月重构了 XGen ，并支持插件化开发 ● 维护和在社区推广 Yao ，三个月让 Yao star 3K+，得到海内外巨头广泛关注，霸榜 Github Trending Golang 分区 ● 成功规划了前端界面引擎的坚实架构，确保系统的可扩展性和性能。 ● 设计并实现了多个高效的前端组件，提高了用户界面的交互性和用户体验。 ● 引入了插件化设计，增强了系统的可定制性，使客户能够轻松扩展应用功能。  ● 风火递小程序的开发与维护。 ● 相关代码的重构。 ● 带领组员学习相关代码的优化与实现。  ● 负责搭建项目架构并主导开发 ● 研究出小程序顶部导航完全自定义的方案，并能将顶部搜索框与胶囊按钮的位 置进行完美适配。构建自定义的底部导航栏，并通过数据中心在导航栏上与页 面进行数据交互，提炼出了小程序功能库 moonjs ; 实践了小程序主页列表的虚 拟滚动，让用户体验提升一个档次。  ● 负责构建微品商城 H5 应用、KOL 用户商城后台以及商城小程序。 ● H5方面，通过研究和模拟小程序 rpx 在不同屏幕尺寸下的自适应效果，写出了 remer.css ，做到了在移动端通过 rem 进行布 局可表现出和 rpx 一样的自适应 效果，同时通过 remer.css 做到了 rpx 和 rem 的互转，在不使用第三方框架的 情况下，可进行 小程序页面代码和 H5 代码的互转。 ● KOL 后台方面，比较了前端三大框架的优缺点，使用 Vue 作为前端技术方案， 通过 Vue 的懒加载提升了 SPA 的首屏加载速 度，通过 Vue 的动态加载使得二 级页面可以通过点击进行加载，提升了应用流畅度。 ● 小程序方面，使用 wxss-cli ，使用 Less 以及小程序原生框架开发小程序。,### Page 4\n沈阳理工大学   本科   计算机科学与技术   2014-2018  教育经历",
			name: '谢闻道-前端开发工程师'
		},
		{
			name: '如何进行科学上网',
			content: '小程序页面代码和'
		},
		{
			name: '如何进行科学上网',
			content: '小程序页面代码和'
		},
		{
			name: '如何进行科学上网',
			content: '小程序页面代码和'
		},
		{
			name: '如何进行科学上网',
			content: '小程序页面代码和'
		}
	] as Array<{ name: string; content: string }>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {}

	onChangeMd(index: number, value: string) {
		this.mds[index].content = value
	}

	onRemove(index: number) {
		this.mds.splice(index, 1)
	}

	save(type: 'fs' | 'note') {}

	async onDrop(files: Array<File>) {
		this.loading = true

		const form_data = new FormData()

		files.forEach((item, index) => form_data.append(`file_${index}`, item))

		const [err, res_raw] = await to(hono.toMarkdown.$post({ form: { files } }))

		this.loading = false

		if (err || !res_raw) return $message.error($t('common.error') + ': ' + err?.message)

		const res = await getJson(res_raw)

		if (res.error) return $message.error($t(`doc_parser.${res.error}`))

		this.mds = res.data
	}

	on() {}

	off() {}
}
