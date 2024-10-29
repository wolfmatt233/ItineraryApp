import { useEffect, useState } from "react";

export default function Login() {
  return (
    <>
      <p>Login</p>
      <form>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
      </form>
    </>
  );
}
