/*
 * @Date: 2023-01-02 12:35:10
 * @Author: liting luz.liting@gmail.com
 * @LastEditors: liting luz.liting@gmail.com
 * @LastEditTime: 2023-01-02 12:47:01
 * @FilePath: /liting-cli/.lintstagedrc.mjs
 */
export default {
  '*.{js,,md}': 'prettier --write --ignore-unknown',
  '*.{js,,md}': 'eslint --fix',
}
