const specialRegex = new RegExp('(\\{|\\}|\\(|\\)|\\[|\\]|\\\\|\\+|\\*|\\.|\\$|\\^|\\||\\?)', 'gim')

export function escape(content) {
  return content.replace(specialRegex, '\\$1')
}
