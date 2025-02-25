import { useMemo, useState } from 'react'

import { useCreateEffect } from '@/hooks'
import { registerLexicalCommandLogger } from '@lexical/utils'

import type { LexicalEditor } from 'lexical'
import type { LexicalCommandLog } from '@lexical/utils'

export default (editor: LexicalEditor) => {
	const [loggedCommands, setLoggedCommands] = useState<LexicalCommandLog>([])

	useCreateEffect(() => {
		return registerLexicalCommandLogger(editor, setLoggedCommands)
	}, [editor])

	return useMemo(() => loggedCommands, [loggedCommands])
}
