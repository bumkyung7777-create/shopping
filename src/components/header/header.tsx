'use client';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/category';
import { useState } from 'react';

export default function Header() {
    const router = useRouter();
    const [isopen, setIsOpin] = useState(false);
    const searchKeyWord = (keyWord: string) => {
        const value = keyWord.trim();
        if (!value) return;
        setIsOpin(false);
        router.push(`/search?q=${value}`);
    };
    return (
        <div>
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
                        <button onClick={() => setIsOpin((prev) => !prev)}>search</button>
                    </div>
                </div>
            </div>
            {isopen && (
                <div>
                    <div className={styles['search-panel']}>
                        <div className="w-full bg-[#f3f3f3] px-9 pt-12 pb-8">
                            <div className="flex items-center justify-between border-b border-black/40 pb-4">
                                <div className="flex items-center gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-10 w-10 text-black"
                                    >
                                        <circle cx="11" cy="11" r="7" />
                                        <path d="m20 20-3.5-3.5" />
                                    </svg>

                                    <input
                                        type="text"
                                        placeholder="검색어를 입력해주세요."
                                        className="w-[420px] bg-transparent text-[18px] text-black placeholder:text-[#9b9b9b] outline-none"
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                searchKeyWord(event.currentTarget.value);
                                            }
                                        }}
                                    />
                                </div>

                                <button
                                    type="button"
                                    aria-label="검색 닫기"
                                    className="shrink-0 text-black"
                                    onClick={() => setIsOpin((prev) => !prev)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-10 w-10"
                                    >
                                        <path d="M6 6l12 12M18 6 6 18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => setIsOpin((prev) => !prev)} className={styles['dim']}></div>
                </div>
            )}
        </div>
    );
}
