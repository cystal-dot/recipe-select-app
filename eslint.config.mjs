import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript','prettier'),
    {
        rules: {
            'no-undef': ['error'], // 未定義の変数をエラーとして検出
            eqeqeq: ['error', 'always'], // 厳密な等価演算子を強制
            'no-console': ['warn'], // console.log の使用を警告
            indent: ['error', 4], // インデントを4スペースで強制
            quotes: ['error', 'single'], // シングルクォートを強制
            semi: ['error', 'always'], // セミコロンを必須に
            'brace-style': ['error', '1tbs'], // ブレースのスタイルを "1tbs" に強制
            camelcase: ['error', { properties: 'always' }], // キャメルケースを強制
            'no-magic-numbers': ['warn', { ignore: [0, 1] }], // マジックナンバーの使用を警告
            'consistent-return': ['error'], // 一貫した return を強制
            'no-var': ['error'], // var の使用を禁止
            complexity: ['warn', { max: 10 }], // 関数の複雑さを制限
            'prefer-const': ['error'], // 再代入されない変数に const を推奨
        },
    },
];

export default eslintConfig;
