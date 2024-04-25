import { JSONObject } from '@expo/json-file';
import * as ProjectUtils from '../project/ProjectUtils';
declare type BuildEventType = 'METRO_INITIALIZE_STARTED' | 'BUILD_STARTED' | 'BUILD_PROGRESS' | 'BUILD_FAILED' | 'BUILD_DONE';
declare type MetroLogRecord = {
    tag: 'metro';
    id: string;
    shouldHide: boolean;
    msg: ReportableEvent | string;
    level: number;
    _metroEventType?: BuildEventType;
};
declare type ExpoLogRecord = {
    tag: 'expo';
    id: string;
    shouldHide: boolean;
    msg: any;
    level: number;
};
declare type DeviceLogRecord = {
    tag: 'device';
    id: string;
    shouldHide: boolean;
    msg: any;
    level: number;
};
export declare type LogRecord = (MetroLogRecord | ExpoLogRecord | DeviceLogRecord) & ProjectUtils.LogFields;
export declare type LogUpdater = (logState: Array<LogRecord>) => Array<LogRecord>;
declare type ErrorObject = {
    name?: string;
    stack?: string;
    message?: string;
    code?: string;
} & JSONObject;
declare type MetroError = ({
    originModulePath: string;
    message: string;
    errors: Array<Object>;
} & ErrorObject) | ({
    type: 'TransformError';
    snippet: string;
    lineNumber: number;
    column: number;
    filename: string;
    errors: Array<Object>;
} & ErrorObject) | ErrorObject;
declare type GlobalCacheDisabledReason = 'too_many_errors' | 'too_many_misses';
declare type BundleDetails = {
    entryFile: string;
    platform: string;
    dev: boolean;
    minify: boolean;
    bundleType: string;
};
declare type ReportableEvent = {
    port: number | undefined;
    projectRoots: ReadonlyArray<string>;
    type: 'initialize_started';
} | {
    type: 'initialize_done';
} | {
    type: 'client_log';
    data: any;
} | {
    type: 'initialize_failed';
    port: number;
    error: MetroError;
} | {
    buildID: string;
    type: 'bundle_build_done';
} | {
    buildID: string;
    type: 'bundle_build_failed';
} | {
    buildID: string;
    bundleDetails: BundleDetails;
    type: 'bundle_build_started';
} | {
    error: MetroError;
    type: 'bundling_error';
} | {
    type: 'dep_graph_loading';
} | {
    type: 'dep_graph_loaded';
} | {
    buildID: string;
    type: 'bundle_transform_progressed';
    transformedFileCount: number;
    totalFileCount: number;
} | {
    type: 'global_cache_error';
    error: MetroError;
} | {
    type: 'global_cache_disabled';
    reason: GlobalCacheDisabledReason;
} | {
    type: 'transform_cache_reset';
} | {
    type: 'worker_stdout_chunk';
    chunk: string;
} | {
    type: 'worker_stderr_chunk';
    chunk: string;
} | {
    type: 'hmr_client_error';
    error: MetroError;
};
declare type StartBuildBundleCallback = (chunk: LogRecord) => void;
declare type ProgressBuildBundleCallback = (progress: number, start: Date | null, chunk: any) => void;
declare type FinishBuildBundleCallback = (error: string | null, start: Date, end: Date, chunk: MetroLogRecord) => void;
export default class PackagerLogsStream {
    _projectRoot: string;
    _getCurrentOpenProjectId: () => any;
    _updateLogs: (updater: LogUpdater) => void;
    _logsToAdd: Array<LogRecord>;
    _bundleBuildChunkID: string | null;
    _onStartBuildBundle?: StartBuildBundleCallback;
    _onProgressBuildBundle?: ProgressBuildBundleCallback;
    _onFinishBuildBundle?: FinishBuildBundleCallback;
    _bundleBuildStart: Date | null;
    _getSnippetForError?: (error: MetroError) => string | null;
    constructor({ projectRoot, getCurrentOpenProjectId, updateLogs, onStartBuildBundle, onProgressBuildBundle, onFinishBuildBundle, getSnippetForError, }: {
        projectRoot: string;
        getCurrentOpenProjectId?: () => any;
        updateLogs: (updater: LogUpdater) => void;
        onStartBuildBundle?: StartBuildBundleCallback;
        onProgressBuildBundle?: ProgressBuildBundleCallback;
        onFinishBuildBundle?: FinishBuildBundleCallback;
        getSnippetForError?: (error: MetroError) => string | null;
    });
    _attachLoggerStream(): void;
    _handleMetroEvent(originalChunk: MetroLogRecord): void;
    _handleBundleTransformEvent: (chunk: MetroLogRecord) => void;
    _handleNewBundleTransformStarted(chunk: MetroLogRecord): void;
    _handleUpdateBundleTransformProgress(progressChunk: MetroLogRecord): void;
    _formatModuleResolutionError(error: MetroError): string | null;
    _formatBundlingError(error: MetroError): string | null;
    _formatWorkerChunk(origin: 'stdout' | 'stderr', chunk: string): string;
    _enqueueAppendLogChunk(chunk: LogRecord): void;
    _enqueueFlushLogsToAdd: () => void;
    _maybeParseMsgJSON(chunk: LogRecord): LogRecord;
    _cleanUpNodeErrors: (chunk: LogRecord) => LogRecord;
}
export {};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iter