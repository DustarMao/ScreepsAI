import {promises as fs} from 'fs'
import path from 'path'

export default async function bundle(baseDir: string = 'dist') {
  function transformSourcePath(p: string, filePath: string) {
    const parts = p.split('/')
    if (parts.length < 1) {
      console.warn('invalid path', p)
      return p
    }
    if (parts[0] === '.') {
      return parts.slice(1).join('.')
    } else {
      console.warn('cannot resolve node_modules', p)
      return p
    }
  }
  function transformFileContent(s: string, filePath: string) {
    return s.replace(/require\("(.*?)"\)/, (_, g1) => `require("${transformSourcePath(g1, filePath)}")`)
  }
  async function compileFile(filePath: string): Promise<void> {
    const stat = await fs.stat(filePath)

    if (stat.isDirectory()) {
      const children = await fs.readdir(filePath)
      await Promise.all(children.map(child => compileFile(path.resolve(filePath, child))))
    } else if (filePath.endsWith('.js')) {
      const content = await fs.readFile(filePath, {encoding: 'utf-8'})
      const key = path.relative(baseDir, filePath).replace(/\.(js|ts)$/, '').replace('\\', '.')
      ret[key] = transformFileContent(content, filePath)
    }
  }

  const ret: Record<string, string> = {}

  await compileFile(baseDir)

  await fs.writeFile(path.resolve(baseDir, 'assets.json'), JSON.stringify(ret, null, 2), {encoding: 'utf-8'})

  return ret
}