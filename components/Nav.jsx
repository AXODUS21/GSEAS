"use client"

import React, { useState, useEffect} from 'react'
import Link from "next/link";
import Image from 'next/image';
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { usePathname } from "next/navigation";

const Nav = () => {
  const {data: session} = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropDown, setToggleDropDown] = useState(false)
  const pathname = usePathname();
  const [navClass, setNavClass] = useState("reset-position");

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);

  useEffect(() => {
    // Apply translate-up class if the route matches `/room/:id` pattern
    if (/^\/room\/[a-zA-Z0-9]+$/.test(pathname)) {
      setNavClass("translate-up");
    } else {
      setNavClass("reset-position");
    }
  }, [pathname]);

  return (
    <div className={`flex justify-between w-full h-24 p-3 ${navClass}`}>
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/assets/logo.png"
          width={70}
          height={70}
          className="rounded-full"
        />
        <p className="font-bold text-xl sm:block hidden">GSEAS</p>
      </Link>

      {/*Desktop Nav */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 items-center">
            <Link href="/create-group">
              <div className="custom_button">
                <span className="custom_circle circle1"></span>
                <span className="custom_circle circle2"></span>
                <span className="custom_circle circle3"></span>
                <span className="custom_circle circle4"></span>
                <span className="custom_circle circle5"></span>
                <p className="custom_text">Create A Group Chat</p>
              </div>
            </Link>
            <button className="custom_button">
              <span className="custom_circle circle1"></span>
              <span className="custom_circle circle2"></span>
              <span className="custom_circle circle3"></span>
              <span className="custom_circle circle4"></span>
              <span className="custom_circle circle5"></span>
              <p className="custom_text" onClick={signOut}>
                Logout
              </p>
            </button>
            <Link href="/profile" className="z-10">
              <Image
                src={session?.user.image}
                width={70}
                alt="profile"
                height={50}
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <div className="flex gap-3 items-center mr-16">
                  <button
                    key={provider.name}
                    className="custom_button"
                    onClick={() => signIn(provider.id)}
                  >
                    <span className="custom_circle circle1"></span>
                    <span className="custom_circle circle2"></span>
                    <span className="custom_circle circle3"></span>
                    <span className="custom_circle circle4"></span>
                    <span className="custom_circle circle5"></span>
                    <p className="custom_text">Login</p>
                  </button>
                </div>
              ))}
          </>
        )}
      </div>

      {/*MOBILE VIEW*/}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width={70}
              height={50}
              className="rounded-full"
              alt="profile"
              onClick={() => {
                setToggleDropDown((prev) => !prev);
              }}
            />
            {toggleDropDown && (
              <div className="dropdown_container">
                <Link href="/create-group">
                  <div className="dropdown_option">
                    <span>
                      <Image src={"/assets/plus.png"} width={10} height={10} />
                    </span>
                    Create A GC
                  </div>
                </Link>
                <Link href="/profile">
                  <div className="dropdown_option">
                    <span>
                      <Image src={"/assets/user.png"} width={10} height={10} />
                    </span>
                    Profile
                  </div>
                </Link>
                <div 
                  onClick={signOut}
                  className="dropdown_option">
                  <span>
                    <Image src={"/assets/logout.png"} width={10} height={10} />
                  </span>
                  Sign Out
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <div className="flex gap-3 items-center mr-16">
                  <button
                    key={provider.name}
                    className="custom_button"
                    onClick={() => signIn(provider.id)}
                  >
                    <span className="custom_circle circle1"></span>
                    <span className="custom_circle circle2"></span>
                    <span className="custom_circle circle3"></span>
                    <span className="custom_circle circle4"></span>
                    <span className="custom_circle circle5"></span>
                    <p className="custom_text">Login</p>
                  </button>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Nav