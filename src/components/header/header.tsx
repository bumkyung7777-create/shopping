'use client';

import styles from './header.module.css';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/category';

export default function Header() {
    return (
        <div className={styles['header']}>
            <div className={styles['header-menu']}>
                <Link href="/">
                    <img
                        src="https://contents.sixshop.com/uploadedFiles/158733/default/image_1750437807923.png"
                        alt=""
                    />
                </Link>
                <ul>
                    {CATEGORIES.map((category) => (
                        <li key={category.slug}>
                            <Link href={`/products?category=${category.slug}`}>
                                {category.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles['search-box']}>
                <div className={styles['search-box-layout']}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-400 search-ico"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://w3.org"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                        </svg>
                    </div>
                    <input
                        type="search"
                        className="w-full py-2 pl-10 pr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="검색어를 입력하세요..."
                    />
                </div>
            </div>
        </div>
    );
}
