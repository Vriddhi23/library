import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import "../styles/Header.css";
import { Link } from "react-router-dom";

function SignUpButton() {
  const clerk = useClerk();

  return (
    <button className="sign-up-btn" onClick={() => clerk.openSignUp({})}>
      Sign up
    </button>
  );
}

function SignInButton() {
  const clerk = useClerk();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    await clerk.openSignIn({});
  };

  return (
    <button className="sign-in-btn" onClick={handleSignIn}>
      Sign in
    </button>
  );
}

function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress.emailAddress;

      // Simulate secure password check (should be done on the server) Replace with actual secure password input handling
      const adminEmail = "vriddhishah21@gnu.ac.in";

      if (email === adminEmail) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [user]);

  const handleRedirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        handleRedirect('/dashboard');
      } else {
        handleRedirect('/userhome');
      }
    }
  }, [isAdmin, user]);

  return (
    <header>
      <nav>
        <SignedOut>
          <ul>
            <li>
              <SignUpButton />
            </li>
            <li>
              <SignInButton />
            </li>
          </ul>
        </SignedOut>

        <SignedIn>
          <ul>
            <li>
              <UserButton className="user-button" afterSignOutUrl="/" />
            </li>
            {isAdmin ? (
              <>
                <li>
                  <Link to='/addbook' style={{textDecoration: 'none'}}>
                    <button className='sign-up-btn' style={{color: "#61dafb"}}>
                      Add
                    </button>
                  </Link>
                  <Link to='/deletebook' style={{textDecoration: 'none'}}>
                    <button className='sign-up-btn' style={{color: "#61dafb"}}>
                      Delete
                    </button>
                  </Link>
                  <Link to='/dashboard' style={{textDecoration: 'none'}}>
                    <button className='sign-up-btn' style={{color: "#61dafb"}}>
                      Dashboard
                    </button>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to='/userhome' style={{textDecoration: 'none'}}>
                    <button className='sign-up-btn' style={{color: "#61dafb"}}>
                      Home
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </SignedIn>
      </nav>
    </header>
  );
}

export default Header;
