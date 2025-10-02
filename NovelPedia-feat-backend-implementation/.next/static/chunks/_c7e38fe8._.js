(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/signup/confirm/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ConfirmPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$confirmSignUp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/confirmSignUp.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ConfirmPage() {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleConfirm = async (e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$confirmSignUp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["confirmSignUp"])({
                username: email,
                confirmationCode: code
            });
            alert('Account confirmed! Please log in.');
            window.location.href = '/signin';
        } catch (error) {
            console.error('Confirm error:', error);
            alert('Failed to confirm: ' + error.message);
        }
        setLoading(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleConfirm,
        className: "p-6 max-w-md mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-lg font-bold mb-4",
                children: "Confirm your account"
            }, void 0, false, {
                fileName: "[project]/src/app/signup/confirm/page.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "w-full p-2 mb-2 border",
                type: "email",
                placeholder: "Email address",
                value: email,
                onChange: (e)=>setEmail(e.target.value),
                required: true
            }, void 0, false, {
                fileName: "[project]/src/app/signup/confirm/page.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "w-full p-2 mb-4 border",
                type: "text",
                placeholder: "Confirmation code",
                value: code,
                onChange: (e)=>setCode(e.target.value),
                required: true
            }, void 0, false, {
                fileName: "[project]/src/app/signup/confirm/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: loading,
                className: "w-full p-2 bg-purple-600 text-white rounded",
                children: loading ? 'Confirming...' : 'Confirm Account'
            }, void 0, false, {
                fileName: "[project]/src/app/signup/confirm/page.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/signup/confirm/page.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(ConfirmPage, "4FXJdz/R28EqHP2hplcRayXR4jo=");
_c = ConfirmPage;
var _c;
__turbopack_context__.k.register(_c, "ConfirmPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        self = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, self, source, getOwner(), maybeKey, debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler");
    Symbol.for("react.provider");
    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        "react-stack-bottom-frame": function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React["react-stack-bottom-frame"].bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren, source, self) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}}),
"[project]/node_modules/@aws-amplify/auth/dist/esm/errors/types/validation.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
__turbopack_context__.s({
    "AuthValidationErrorCode": (()=>AuthValidationErrorCode)
});
var AuthValidationErrorCode;
(function(AuthValidationErrorCode) {
    AuthValidationErrorCode["EmptySignInUsername"] = "EmptySignInUsername";
    AuthValidationErrorCode["EmptySignInPassword"] = "EmptySignInPassword";
    AuthValidationErrorCode["CustomAuthSignInPassword"] = "CustomAuthSignInPassword";
    AuthValidationErrorCode["EmptySignUpUsername"] = "EmptySignUpUsername";
    AuthValidationErrorCode["EmptySignUpPassword"] = "EmptySignUpPassword";
    AuthValidationErrorCode["EmptyConfirmSignUpUsername"] = "EmptyConfirmSignUpUsername";
    AuthValidationErrorCode["EmptyConfirmSignUpCode"] = "EmptyConfirmSignUpCode";
    AuthValidationErrorCode["EmptyResendSignUpCodeUsername"] = "EmptyresendSignUpCodeUsername";
    AuthValidationErrorCode["EmptyChallengeResponse"] = "EmptyChallengeResponse";
    AuthValidationErrorCode["EmptyConfirmResetPasswordUsername"] = "EmptyConfirmResetPasswordUsername";
    AuthValidationErrorCode["EmptyConfirmResetPasswordNewPassword"] = "EmptyConfirmResetPasswordNewPassword";
    AuthValidationErrorCode["EmptyConfirmResetPasswordConfirmationCode"] = "EmptyConfirmResetPasswordConfirmationCode";
    AuthValidationErrorCode["EmptyResetPasswordUsername"] = "EmptyResetPasswordUsername";
    AuthValidationErrorCode["EmptyVerifyTOTPSetupCode"] = "EmptyVerifyTOTPSetupCode";
    AuthValidationErrorCode["EmptyConfirmUserAttributeCode"] = "EmptyConfirmUserAttributeCode";
    AuthValidationErrorCode["IncorrectMFAMethod"] = "IncorrectMFAMethod";
    AuthValidationErrorCode["EmptyUpdatePassword"] = "EmptyUpdatePassword";
})(AuthValidationErrorCode || (AuthValidationErrorCode = {}));
;
 //# sourceMappingURL=validation.mjs.map
}}),
"[project]/node_modules/@aws-amplify/auth/dist/esm/common/AuthErrorStrings.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthErrorCodes": (()=>AuthErrorCodes),
    "AuthErrorStrings": (()=>AuthErrorStrings),
    "validationErrorMap": (()=>validationErrorMap)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/errors/types/validation.mjs [app-client] (ecmascript)");
;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const validationErrorMap = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyChallengeResponse]: {
        message: 'challengeResponse is required to confirmSignIn'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyConfirmResetPasswordUsername]: {
        message: 'username is required to confirmResetPassword'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyConfirmSignUpCode]: {
        message: 'code is required to confirmSignUp'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyConfirmSignUpUsername]: {
        message: 'username is required to confirmSignUp'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyConfirmResetPasswordConfirmationCode]: {
        message: 'confirmationCode is required to confirmResetPassword'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyConfirmResetPasswordNewPassword]: {
        message: 'newPassword is required to confirmResetPassword'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyResendSignUpCodeUsername]: {
        message: 'username is required to confirmSignUp'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyResetPasswordUsername]: {
        message: 'username is required to resetPassword'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptySignInPassword]: {
        message: 'password is required to signIn'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptySignInUsername]: {
        message: 'username is required to signIn'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptySignUpPassword]: {
        message: 'password is required to signUp'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptySignUpUsername]: {
        message: 'username is required to signUp'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].CustomAuthSignInPassword]: {
        message: 'A password is not needed when signing in with CUSTOM_WITHOUT_SRP',
        recoverySuggestion: 'Do not include a password in your signIn call.'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].IncorrectMFAMethod]: {
        message: 'Incorrect MFA method was chosen. It should be either SMS, TOTP, or EMAIL',
        recoverySuggestion: 'Try to pass SMS, TOTP, or EMAIL as the challengeResponse'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyVerifyTOTPSetupCode]: {
        message: 'code is required to verifyTotpSetup'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyUpdatePassword]: {
        message: 'oldPassword and newPassword are required to changePassword'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyConfirmUserAttributeCode]: {
        message: 'confirmation code is required to confirmUserAttribute'
    }
};
// TODO: delete this code when the Auth class is removed.
var AuthErrorStrings;
(function(AuthErrorStrings) {
    AuthErrorStrings["DEFAULT_MSG"] = "Authentication Error";
    AuthErrorStrings["EMPTY_EMAIL"] = "Email cannot be empty";
    AuthErrorStrings["EMPTY_PHONE"] = "Phone number cannot be empty";
    AuthErrorStrings["EMPTY_USERNAME"] = "Username cannot be empty";
    AuthErrorStrings["INVALID_USERNAME"] = "The username should either be a string or one of the sign in types";
    AuthErrorStrings["EMPTY_PASSWORD"] = "Password cannot be empty";
    AuthErrorStrings["EMPTY_CODE"] = "Confirmation code cannot be empty";
    AuthErrorStrings["SIGN_UP_ERROR"] = "Error creating account";
    AuthErrorStrings["NO_MFA"] = "No valid MFA method provided";
    AuthErrorStrings["INVALID_MFA"] = "Invalid MFA type";
    AuthErrorStrings["EMPTY_CHALLENGE"] = "Challenge response cannot be empty";
    AuthErrorStrings["NO_USER_SESSION"] = "Failed to get the session because the user is empty";
    AuthErrorStrings["NETWORK_ERROR"] = "Network Error";
    AuthErrorStrings["DEVICE_CONFIG"] = "Device tracking has not been configured in this User Pool";
    AuthErrorStrings["AUTOSIGNIN_ERROR"] = "Please use your credentials to sign in";
    AuthErrorStrings["OAUTH_ERROR"] = "Couldn't finish OAuth flow, check your User Pool HostedUI settings";
})(AuthErrorStrings || (AuthErrorStrings = {}));
var AuthErrorCodes;
(function(AuthErrorCodes) {
    AuthErrorCodes["SignInException"] = "SignInException";
    AuthErrorCodes["OAuthSignInError"] = "OAuthSignInException";
})(AuthErrorCodes || (AuthErrorCodes = {}));
;
 //# sourceMappingURL=AuthErrorStrings.mjs.map
}}),
"[project]/node_modules/@aws-amplify/auth/dist/esm/errors/utils/assertValidationError.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "assertValidationError": (()=>assertValidationError)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$common$2f$AuthErrorStrings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/common/AuthErrorStrings.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$AuthError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/errors/AuthError.mjs [app-client] (ecmascript)");
;
;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function assertValidationError(assertion, name) {
    const { message, recoverySuggestion } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$common$2f$AuthErrorStrings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validationErrorMap"][name];
    if (!assertion) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$AuthError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthError"]({
            name,
            message,
            recoverySuggestion
        });
    }
}
;
 //# sourceMappingURL=assertValidationError.mjs.map
}}),
"[project]/node_modules/@aws-amplify/auth/dist/esm/utils/getAuthUserAgentValue.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getAuthUserAgentValue": (()=>getAuthUserAgentValue)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$Platform$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/core/dist/esm/Platform/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$Platform$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/core/dist/esm/Platform/types.mjs [app-client] (ecmascript)");
;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getAuthUserAgentValue = (action, customUserAgentDetails)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$Platform$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAmplifyUserAgent"])({
        category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$Platform$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Category"].Auth,
        action,
        ...customUserAgentDetails
    });
;
 //# sourceMappingURL=getAuthUserAgentValue.mjs.map
}}),
"[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/userContextData.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
__turbopack_context__.s({
    "getUserContextData": (()=>getUserContextData)
});
function getUserContextData({ username, userPoolId, userPoolClientId }) {
    if (typeof window === 'undefined') {
        return undefined;
    }
    const amazonCognitoAdvancedSecurityData = window.AmazonCognitoAdvancedSecurityData;
    if (typeof amazonCognitoAdvancedSecurityData === 'undefined') {
        return undefined;
    }
    const advancedSecurityData = amazonCognitoAdvancedSecurityData.getData(username, userPoolId, userPoolClientId);
    if (advancedSecurityData) {
        const userContextData = {
            EncodedData: advancedSecurityData
        };
        return userContextData;
    }
    return {};
}
;
 //# sourceMappingURL=userContextData.mjs.map
}}),
"[project]/node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createConfirmSignUpClient.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createConfirmSignUpClient": (()=>createConfirmSignUpClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$clients$2f$internal$2f$composeServiceApi$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/core/dist/esm/clients/internal/composeServiceApi.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$shared$2f$handler$2f$cognitoUserPoolTransferHandler$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$shared$2f$serde$2f$createUserPoolSerializer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/shared/serde/createUserPoolSerializer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$shared$2f$serde$2f$createUserPoolDeserializer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/shared/serde/createUserPoolDeserializer.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createConfirmSignUpClient = (config)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$clients$2f$internal$2f$composeServiceApi$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeServiceApi"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$shared$2f$handler$2f$cognitoUserPoolTransferHandler$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cognitoUserPoolTransferHandler"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$shared$2f$serde$2f$createUserPoolSerializer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserPoolSerializer"])('ConfirmSignUp'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$shared$2f$serde$2f$createUserPoolDeserializer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserPoolDeserializer"])(), {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SERVICE_CLIENT_API_CONFIG"],
        ...config
    });
;
 //# sourceMappingURL=createConfirmSignUpClient.mjs.map
}}),
"[project]/node_modules/@aws-amplify/auth/dist/esm/client/utils/store/autoSignInStore.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
__turbopack_context__.s({
    "autoSignInStore": (()=>autoSignInStore)
});
function defaultState() {
    return {
        active: false
    };
}
const autoSignInReducer = (state, action)=>{
    switch(action.type){
        case 'SET_USERNAME':
            return {
                ...state,
                username: action.value
            };
        case 'SET_SESSION':
            return {
                ...state,
                session: action.value
            };
        case 'START':
            return {
                ...state,
                active: true
            };
        case 'RESET':
            return defaultState();
        default:
            return state;
    }
};
const createAutoSignInStore = (reducer)=>{
    let currentState = reducer(defaultState(), {
        type: 'RESET'
    });
    return {
        getState: ()=>currentState,
        dispatch: (action)=>{
            currentState = reducer(currentState, action);
        }
    };
};
const autoSignInStore = createAutoSignInStore(autoSignInReducer);
;
 //# sourceMappingURL=autoSignInStore.mjs.map
}}),
"[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/autoSignIn.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "autoSignIn": (()=>autoSignIn),
    "resetAutoSignIn": (()=>resetAutoSignIn),
    "setAutoSignIn": (()=>setAutoSignIn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$client$2f$utils$2f$store$2f$autoSignInStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/client/utils/store/autoSignInStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$AuthError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/errors/AuthError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/errors/constants.mjs [app-client] (ecmascript)");
;
;
;
;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const initialAutoSignIn = async ()=>{
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$AuthError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthError"]({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTO_SIGN_IN_EXCEPTION"],
        message: 'The autoSignIn flow has not started, or has been cancelled/completed.',
        recoverySuggestion: 'Please try to use the signIn API or log out before starting a new autoSignIn flow.'
    });
};
/**
 * Signs a user in automatically after finishing the sign-up process.
 *
 * This API will automatically sign a user in if the autoSignIn flow has been completed in the following cases:
 * - User confirmed their account with a verification code sent to their phone or email (default option).
 * - User confirmed their account with a verification link sent to their phone or email. In order to
 * enable this option you need to go to the Amazon Cognito [console](https://aws.amazon.com/pm/cognito),
 * look for your userpool, then go to the `Messaging` tab and enable `link` mode inside the `Verification message` option.
 * Finally you need to define the `signUpVerificationMethod` in your `Auth` config.
 *
 * @example
 * ```typescript
 *  Amplify.configure({
 *    Auth: {
 *     Cognito: {
 *    ...cognitoConfig,
 *    signUpVerificationMethod: "link" // the default value is "code"
 *   }
 *	}});
 * ```
 *
 * @throws AutoSignInException - Thrown when the autoSignIn flow has not started, or has been cancelled/completed.
 * @returns The signInOutput.
 *
 * @example
 * ```typescript
 *  // handleSignUp.ts
 * async function handleSignUp(
 *   username:string,
 *   password:string
 * ){
 *   try {
 *     const { nextStep } = await signUp({
 *       username,
 *       password,
 *       options: {
 *         userAttributes:{ email:'email@email.com'},
 *         autoSignIn: true // This enables the auto sign-in flow.
 *       },
 *     });
 *
 *     handleSignUpStep(nextStep);
 *
 *   } catch (error) {
 *     console.log(error);
 *   }
 * }
 *
 * // handleConfirmSignUp.ts
 * async function handleConfirmSignUp(username:string, confirmationCode:string) {
 *   try {
 *     const { nextStep } = await confirmSignUp({
 *       username,
 *       confirmationCode,
 *     });
 *
 *     handleSignUpStep(nextStep);
 *   } catch (error) {
 *     console.log(error);
 *   }
 * }
 *
 * // signUpUtils.ts
 * async function handleSignUpStep( step: SignUpOutput["nextStep"]) {
 * switch (step.signUpStep) {
 *   case "CONFIRM_SIGN_UP":
 *
 *    // Redirect end-user to confirm-sign up screen.
 *
 *   case "COMPLETE_AUTO_SIGN_IN":
 *	   const codeDeliveryDetails = step.codeDeliveryDetails;
 *     if (codeDeliveryDetails) {
 *      // Redirect user to confirm-sign-up with link screen.
 *     }
 *     const signInOutput = await autoSignIn();
 *   // handle sign-in steps
 * }
 *
 * ```
 */ // TODO(Eslint): can this be refactored not using `let` on exported member?
// eslint-disable-next-line import/no-mutable-exports
let autoSignIn = initialAutoSignIn;
/**
 * Sets the context of autoSignIn at run time.
 * @internal
 */ function setAutoSignIn(callback) {
    autoSignIn = callback;
}
/**
 * Resets the context
 *
 * @internal
 */ function resetAutoSignIn(resetCallback = true) {
    if (resetCallback) {
        autoSignIn = initialAutoSignIn;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$client$2f$utils$2f$store$2f$autoSignInStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["autoSignInStore"].dispatch({
        type: 'RESET'
    });
}
;
 //# sourceMappingURL=autoSignIn.mjs.map
}}),
"[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/confirmSignUp.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "confirmSignUp": (()=>confirmSignUp)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$singleton$2f$Amplify$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/core/dist/esm/singleton/Amplify.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$singleton$2f$Auth$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/core/dist/esm/singleton/Auth/utils/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$Platform$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/core/dist/esm/Platform/types.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$Hub$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/core/dist/esm/Hub/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$utils$2f$assertValidationError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/errors/utils/assertValidationError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/errors/types/validation.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$parsers$2f$regionParsers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/foundation/parsers/regionParsers.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$utils$2f$getAuthUserAgentValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/utils/getAuthUserAgentValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$utils$2f$userContextData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/userContextData.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$createConfirmSignUpClient$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createConfirmSignUpClient.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$factories$2f$createCognitoUserPoolEndpointResolver$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/factories/createCognitoUserPoolEndpointResolver.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$client$2f$utils$2f$store$2f$autoSignInStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/client/utils/store/autoSignInStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$autoSignIn$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/autoSignIn.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Confirms a new user account.
 *
 * @param input -  The ConfirmSignUpInput object.
 * @returns ConfirmSignUpOutput
 * @throws -{@link ConfirmSignUpException }
 * Thrown due to an invalid confirmation code.
 * @throws -{@link AuthValidationErrorCode }
 * Thrown due to an empty confirmation code
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */ async function confirmSignUp(input) {
    const { username, confirmationCode, options } = input;
    const authConfig = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$singleton$2f$Amplify$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Amplify"].getConfig().Auth?.Cognito;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$singleton$2f$Auth$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertTokenProviderConfig"])(authConfig);
    const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig;
    const clientMetadata = options?.clientMetadata;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$utils$2f$assertValidationError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertValidationError"])(!!username, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyConfirmSignUpUsername);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$utils$2f$assertValidationError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertValidationError"])(!!confirmationCode, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$errors$2f$types$2f$validation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthValidationErrorCode"].EmptyConfirmSignUpCode);
    const UserContextData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$utils$2f$userContextData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserContextData"])({
        username,
        userPoolId,
        userPoolClientId
    });
    const confirmSignUpClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$factories$2f$serviceClients$2f$cognitoIdentityProvider$2f$createConfirmSignUpClient$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createConfirmSignUpClient"])({
        endpointResolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$factories$2f$createCognitoUserPoolEndpointResolver$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCognitoUserPoolEndpointResolver"])({
            endpointOverride: userPoolEndpoint
        })
    });
    const { Session: session } = await confirmSignUpClient({
        region: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$foundation$2f$parsers$2f$regionParsers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRegionFromUserPoolId"])(authConfig.userPoolId),
        userAgentValue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$utils$2f$getAuthUserAgentValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthUserAgentValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$Platform$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthAction"].ConfirmSignUp)
    }, {
        Username: username,
        ConfirmationCode: confirmationCode,
        ClientMetadata: clientMetadata,
        ForceAliasCreation: options?.forceAliasCreation,
        ClientId: authConfig.userPoolClientId,
        UserContextData
    });
    return new Promise((resolve, reject)=>{
        try {
            const signUpOut = {
                isSignUpComplete: true,
                nextStep: {
                    signUpStep: 'DONE'
                }
            };
            const autoSignInStoreState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$client$2f$utils$2f$store$2f$autoSignInStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["autoSignInStore"].getState();
            if (!autoSignInStoreState.active || autoSignInStoreState.username !== username) {
                resolve(signUpOut);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$providers$2f$cognito$2f$apis$2f$autoSignIn$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetAutoSignIn"])();
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$auth$2f$dist$2f$esm$2f$client$2f$utils$2f$store$2f$autoSignInStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["autoSignInStore"].dispatch({
                type: 'SET_SESSION',
                value: session
            });
            const stopListener = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$Hub$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HubInternal"].listen('auth-internal', ({ payload })=>{
                switch(payload.event){
                    case 'autoSignIn':
                        resolve({
                            isSignUpComplete: true,
                            nextStep: {
                                signUpStep: 'COMPLETE_AUTO_SIGN_IN'
                            }
                        });
                        stopListener();
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$amplify$2f$core$2f$dist$2f$esm$2f$Hub$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HubInternal"].dispatch('auth-internal', {
                event: 'confirmSignUp',
                data: signUpOut
            });
        } catch (error) {
            reject(error);
        }
    });
}
;
 //# sourceMappingURL=confirmSignUp.mjs.map
}}),
}]);

//# sourceMappingURL=_c7e38fe8._.js.map